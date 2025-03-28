import React, { createContext, useState, useContext } from 'react';

const MediaStreamContext = createContext({
    localStream: null,
    setLocalStream: () => {},
    remoteStream: null,
    setRemoteStream: () => {},
});

export const MediaStreamProvider = ({ children }) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnectionRef, setPeerConnectionRef] = useState(null);
    return (
        <MediaStreamContext.Provider value={{ 
            localStream, 
            setLocalStream, 
            remoteStream, 
            setRemoteStream,
            peerConnectionRef,
            setPeerConnectionRef 
        }}>
            {children}
        </MediaStreamContext.Provider>
    );
};

export const useMediaStream = () => useContext(MediaStreamContext);