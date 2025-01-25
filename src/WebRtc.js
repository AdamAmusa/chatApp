import { useState, useEffect, useContext, useRef } from "react";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ensure correct import
import { AuthContext } from "./context";
import { ChatContext } from "./ChatContext";
import { useNavigate } from "react-router-dom";
import { useMediaStream } from "./MediaStreamContext"; // Ensure correct import


const configuration = {
    iceServers: [
        //via cloudflare
        {
            urls: 'turn:turn.speed.cloudflare.com:50000',
            username: 'a9fe0be96ed831ffe7823a6c722c15c12c76c66e13b16ffbebb6cc0d4ca2dc5361aaf8172355f19e044aad55201e3c6d56f3908a0d556511ce84b600e342cff8',
            credential: 'aba9b169546eb6dcc7bfb1cdf34544cf95b5161d602e3b5fa7c8342b2e9802fb',
        },
    ]
};
export const useCallStatus = () => {
    const { currentUser } = useContext(AuthContext);
    const [callStatus, setCallStatus] = useState("idle");





    useEffect(() => {
        if (!currentUser) return;

        console.log("useCallStatus");
        const signalingDoc = doc(db, `signaling/${currentUser.uid}`);
        const unsubscribe = onSnapshot(signalingDoc, snapshot => {
            const message = snapshot.data();
            if (message && message.offer) {
                setCallStatus("pending");
            } else {
                setCallStatus("idle");
            }
        });

        return () => {
            unsubscribe();
        };
    }, [currentUser]);

    return [callStatus, setCallStatus];
};




export const useMakeCall = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const { setLocalStream, remoteStream, setRemoteStream } = useMediaStream();
    const iceCandidatesQueue = useRef([]);

    const peerConnectionRef = useRef(null);
    

    const makeCall = async () => {
        console.log("makeCall");
        const receiverDoc = doc(db, `signaling/${data.user.uid}`);

        peerConnectionRef.current = new RTCPeerConnection(configuration);

        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(localStream);
            localStream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, localStream);
            });
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Error accessing media devices: " + error.message);
            return;
        }

        const signalingDoc = doc(db, `signaling/${currentUser.uid}`);
        const roomSnapshot = await getDoc(signalingDoc);

        if (!roomSnapshot.exists()) {
            await setDoc(signalingDoc, {
                offer: null,
                answer: null,
                iceCandidates: []
            });
        }

        peerConnectionRef.current.onicecandidate = async event => {
            if (event.candidate) {
                console.log("Creating ICE candidate", event.candidate);
                const iceCandidatesCollection = collection(signalingDoc, 'iceCandidates');
                await addDoc(iceCandidatesCollection, event.candidate.toJSON());
            } else {
                console.log("ICE candidate gathering complete");
            }
        };

        peerConnectionRef.current.onicegatheringstatechange = () => {
            console.log("ICE gathering state: ", peerConnectionRef.current.iceGatheringState);
        };

        peerConnectionRef.current.onconnectionstatechange = () => {
            console.log("Connection state: ", peerConnectionRef.current.connectionState);
        };

        peerConnectionRef.current.ontrack = event => {
            console.log('Got remote track:', event.streams[0]);
            setRemoteStream(event.streams[0]);
        };
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        await setDoc(receiverDoc, {
            offer: {
                offerId: offer.sdp,
                sender: currentUser.uid
            }
        });

        onSnapshot(signalingDoc, async snapshot => {
            const data = snapshot.data();
            if (data.answer) {
                if (peerConnectionRef.current.signalingState === "have-local-offer") {
                    const remoteDesc = new RTCSessionDescription({
                        type: 'answer',
                        sdp: data.answer.sdp
                    });
                    console.log("Setting remote description", remoteDesc);
                    await peerConnectionRef.current.setRemoteDescription(remoteDesc);

                    // Add queued ICE candidates
                    while (iceCandidatesQueue.current.length > 0) {
                        const candidate = iceCandidatesQueue.current.shift();
                        try {
                            console.log("Adding queued ICE candidate", candidate);
                            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                        } catch (e) {
                            console.error('Error adding received ice candidate', e);
                        }
                    }
                }
            }

            // Query the iceCandidates subcollection
            const iceCandidatesCollection = collection(signalingDoc, 'iceCandidates');
            const iceCandidatesSnapshot = await getDocs(iceCandidatesCollection);
            iceCandidatesSnapshot.forEach(doc => {
                const candidate = doc.data();
                if (peerConnectionRef.current.signalingState === "stable") {
                    try {
                        console.log("Adding ICE candidate (Requester)", candidate);
                        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                } else {
                    console.log("Queueing ICE candidate", candidate);
                    iceCandidatesQueue.current.push(candidate);
                }
            });
        });



        // Navigate to the Call component and pass parameters
        navigate("/call");
    };

    return makeCall;
};

export const useReceiveCall = () => {
    const { currentUser } = useContext(AuthContext);
    const { setLocalStream, setRemoteStream } = useMediaStream();
    const peerConnectionRef = useRef(null);
    const navigate = useNavigate();
    const iceCandidatesQueue = useRef([]);


    const receiveCall = async () => {
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log("Local track is " + localStream);
            setLocalStream(localStream);
            localStream.getTracks().forEach(track => {
                console.log('Add a track to the peer connection:', track);
                peerConnectionRef.current.addTrack(track, localStream);
            });
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Error accessing media devices: " + error.message);
            return;
        }

        const signalingDoc = doc(db, `signaling/${currentUser.uid}`);
        onSnapshot(signalingDoc, async snapshot => {
            const message = snapshot.data();
            const senderDoc = doc(db, `signaling/${message.offer.sender}`);
            const iceCandidates = collection(senderDoc, 'iceCandidates');
            if (message && message.offer) {
                const remoteDesc = new RTCSessionDescription({
                    type: 'offer',
                    sdp: message.offer.offerId
                });

                await peerConnectionRef.current.setRemoteDescription(remoteDesc);
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);


                await updateDoc(senderDoc, { answer: { type: answer.type, sdp: answer.sdp } });
                while (iceCandidatesQueue.current.length > 0) {
                    const candidate = iceCandidatesQueue.current.shift();
                    try {
                        console.log("Adding queued ICE candidate", candidate);
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                }
            }

            const iceCandidatesSnapshot = await getDocs(iceCandidates);
            iceCandidatesSnapshot.forEach(doc => {
                const candidate = doc.data();
                console.log("Received ICE candidate", candidate);
                if (peerConnectionRef.current.signalingState === "stable") {
                    try {
                        console.log("Adding ICE candidate", candidate);
                        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                } else {
                    console.log("Queueing ICE candidate", candidate);
                    iceCandidatesQueue.current.push(candidate);
                }
            });
        });

        peerConnectionRef.current.ontrack = event => {
            console.log('Got remote track:', event.streams[0]);
            setRemoteStream(event.streams[0]);
        };
        navigate("/call");
    };

    return receiveCall;
};

const WebRtc = () => {
    // Your WebRTC component implementation
};

export default WebRtc;