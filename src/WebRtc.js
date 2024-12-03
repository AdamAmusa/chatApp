import { useState, useEffect, useContext, useRef } from "react";
import { doc, setDoc, getDoc, onSnapshot, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "./server"; // Ensure correct import
import { AuthContext } from "./context";
import { ChatContext } from "./ChatContext";
import { useNavigate } from "react-router-dom";
import { useMediaStream } from "./MediaStreamContext"; // Ensure correct import

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
    const { setLocalStream, localStream } = useMediaStream();
    const [remoteStream, setRemoteStream] = useState(new MediaStream());
    const peerConnectionRef = useRef(null);

    const makeCall = async () => {
        console.log("makeCall");
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
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

        peerConnectionRef.current.ontrack = event => {
            console.log('Got remote track:', event.streams[0]);
            const [remoteStream] = event.streams;
            setRemoteStream(remoteStream);
        };

        peerConnectionRef.current.onicecandidate = async event => {
            if (event.candidate) {
                console.log("Creating ICE candidate", event.candidate);
                const iceCandidatesCollection = collection(receiverDoc, 'iceCandidates');
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
            event.streams[0].getTracks().forEach(track => {
                console.log('Add a track to the remoteStream:', track);
                remoteStream.addTrack(track);
            });
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
                    await peerConnectionRef.current.setRemoteDescription(remoteDesc);
                }
            }
            if (data.iceCandidates) {
                for (const candidate of data.iceCandidates) {
                    try {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                }
            }
        });

        // Navigate to the Call component and pass parameters
        navigate("/call");
    };

    return makeCall;
};

export const useReceiveCall = () => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const { setLocalStream, localStream } = useMediaStream();
    const { setRemoteStream, remoteStream } = useMediaStream();
    const peerConnectionRef = useRef(null);
    const navigate = useNavigate();


    const receiveCall = async () => {
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
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
            if (message && message.offer) {
                const remoteDesc = new RTCSessionDescription({
                    type: 'offer',
                    sdp: message.offer.offerId
                });
                const senderDoc = doc(db, `signaling/${message.offer.sender}`);
                await peerConnectionRef.current.setRemoteDescription(remoteDesc);
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                await updateDoc(senderDoc, { answer: { type: answer.type, sdp: answer.sdp } });
            } else if (message && message.iceCandidates) {
                for (const candidate of message.iceCandidates) {
                    try {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('Error adding received ice candidate', e);
                    }
                }
            }
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