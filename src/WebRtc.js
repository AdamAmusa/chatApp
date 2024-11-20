import { Web } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { onValue, ref, set, get, push } from "firebase/database";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./server";
import { AuthContext } from "./context";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";


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
        const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
        const peerConnection = new RTCPeerConnection(configuration);

        const signalingDoc = doc(db, `signaling/${currentUser.uid}`);
        const roomSnapshot = await getDoc(signalingDoc);

        if (!roomSnapshot.exists()) {
            await setDoc(signalingDoc, {
                offer: null,
                answer: null,
                iceCandidates: []
            });
        }

        peerConnection.onicecandidate = async event => {
            if (event.candidate) {
                const iceCandidatesCollection = collection(db, `signaling/${currentUser.uid}/iceCandidates`);
                await addDoc(iceCandidatesCollection, event.candidate.toJSON());
            }
        };
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
        await updateDoc(signalingDoc2, { offer: offer.sdp });
    };

    return makeCall;
};


export const useReceiveCall = () => {
const { currentUser } = useContext(AuthContext);
const { otherUser } = useContext(ChatContext);
const receiveCall = async ()=> {
    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
    const peerConnection = new RTCPeerConnection(configuration);
    const signalingRef = ref(db, `signaling/${currentUser.uid}`);
    onSnapshot(signalingRef, async snapshot => {
        const data = snapshot.val();
        if (data.offer) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            set(ref(db, `signaling/${otherUser.uid}/answer`), answer.sdp);
        }
        else if (data.iceCandidate) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        }
    });
}
}
const WebRtc = () => {

}
export default WebRtc;