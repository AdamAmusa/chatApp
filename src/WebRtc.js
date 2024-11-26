import { Web } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { onValue, ref} from "firebase/database";
import { addDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { db } from "./server";
import { AuthContext } from "./context";
import { ChatContext } from "./ChatContext";
import { useContext, useRef } from "react";


let localStream = null;
let remoteStream = null;
let peerConnection = null;

    

const configuration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.l.google.com:5349" },
        { urls: "stun:stun1.l.google.com:3478" },
        { urls: "stun:stun1.l.google.com:5349" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:5349" },
        { urls: "stun:stun3.l.google.com:3478" },
        { urls: "stun:stun3.l.google.com:5349" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:5349" }
    ]
};

export const useCallStatus = () => {
    const [callStatus, setCallStatus] = useState("idle");
    const { currentUser } = useContext(AuthContext);

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

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);


    const makeCall = async () => {
        console.log("makeCall");


        peerConnection = new RTCPeerConnection(configuration);
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.addEventListener('icecandidate', event => {
            console.log("peerConnection ", peerConnection);
            if (event.candidate) {
                const candidateData = {
                    candidate: event.candidate.candidate,
                    sdpMid: event.candidate.sdpMid,
                    sdpMLineIndex: event.candidate.sdpMLineIndex
                };

                const iceCandidatesdoc = doc(db, `signaling/${data.user.uid}/iceCandidates`);
                addDoc(iceCandidatesdoc, candidateData);
            }
        });


        const signalingDoc = doc(db, `signaling/${currentUser.uid}`);
        const roomSnapshot = await getDoc(signalingDoc);




        onSnapshot(signalingDoc, async snapshot => {
            const data = snapshot.data();
            if (data.answer) {
                const remoteDesc = new RTCSessionDescription(data.answer);
                await peerConnection.setRemoteDescription(remoteDesc);
            }
            if (data.iceCandidates) {
                try {
                    await peerConnection.addIceCandidate(data.iceCandidates);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            }

        });

        if (!roomSnapshot.exists()) {
            await setDoc(signalingDoc, {
                offer: [],
                answer: null,
                iceCandidates: []
            });
        }


        const signalingDoc2 = doc(db, `signaling/${data.user.uid}`);
        const roomSnapshot2 = await getDoc(signalingDoc2);
        if (!roomSnapshot2.exists()) {
            await setDoc(signalingDoc2, {
                offer: null,
                answer: null,
                iceCandidates: []
            });
        }

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await updateDoc(signalingDoc2, {
            offer: {
                offerId: offer.sdp,
                sender: currentUser.uid
            }
        });
    };

    return makeCall;
};

export const useReceiveCall = () => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);


    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(new MediaStream());

 const receiveCall = async () => {
    try {
        // Get user media
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });

        // Set up signaling document reference
        const signalingRef = doc(db, 'signaling', currentUser.uid);
        const roomSnapshot = await getDoc(signalingRef);

        if (roomSnapshot.exists()) {
            // Create and set up peer connection
            peerConnectionRef.current = new RTCPeerConnection(configuration);
            
            // Add local tracks to peer connection
            localStreamRef.current.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, localStreamRef.current);
            });

            // Handle ICE candidates
            const iceCandidatesCollection = collection(db, 'signaling', currentUser.uid, 'iceCandidates');
            
            peerConnectionRef.current.addEventListener('icecandidate', event => {
                if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                }
                console.log('Got candidate: ', event.candidate);
                addDoc(iceCandidatesCollection, event.candidate.toJSON());
            });

            // Handle remote tracks
            peerConnectionRef.current.addEventListener('track', event => {
                console.log('Got remote track:', event.streams[0]);
                event.streams[0].getTracks().forEach(track => {
                    console.log('Add a track to the remoteStream:', track);
                    remoteStreamRef.current.addTrack(track);
                });
            });

            

            // Listen for signaling changes
            onSnapshot(signalingRef, async snapshot => {
                const data = snapshot.data();
                
                if (data?.offer && data.offer.offerId) {
                   const remoteDesc =  await peerConnectionRef.current.setRemoteDescription(
                        new RTCSessionDescription({
                            type: 'offer',
                            sdp: data.offer.offerId})
                    );
                    
                    const answer = await peerConnectionRef.current.createAnswer();
                    await peerConnectionRef.current.setLocalDescription(answer);
                    await peerConnectionRef.current.setRemoteDescription(remoteDesc);
                    const otherUserSignalingRef = doc(db, 'signaling', data.offer.sender);
                    await updateDoc(otherUserSignalingRef, {
                        answer: {
                            type: answer.type,
                            sdp: answer.sdp
                        }
                    });
                }
            });
            const signalingRef2 = doc(db, 'signaling', data.user.uid);
            // Listen for ICE candidates
            onSnapshot(signalingRef2, 'iceCandidates', 
                snapshot => {
                    snapshot.docChanges().forEach(async change => {
                        if (change.type === 'added') {
                            const candidate = change.doc.data();
                            try {
                                await peerConnectionRef.current.addIceCandidate(
                                    new RTCIceCandidate(candidate)
                                );
                            } catch (e) {
                                console.error('Error adding received ice candidate', e);
                            }
                        }
                    });
                }
            );
        }
    } catch (error) {
        console.error('Error in receiveCall:', error);
        throw error;
    }
   
}; 
return receiveCall;
}

const WebRtc = () => {

}
export default WebRtc;