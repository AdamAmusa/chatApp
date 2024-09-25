// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ChatPage from "./chatPage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
    apiKey: "AIzaSyB-UZBt0wfBSjX9LIKcmWvJ5EOzh4JtWR0",
    authDomain: "chat-e48d2.firebaseapp.com",
    projectId: "chat-e48d2",
    storageBucket: "chat-e48d2.appspot.com",
    messagingSenderId: "485655526487",
    appId: "1:485655526487:web:95eb688ead5ed43e0b7712",
    measurementId: "G-4CGDENJTGF"
});

// Initialize Firebase
const auth = firebase.auth();
const firebase = firebase.firestore();


const [user] = useAuthState(auth);

function Server() {
    return (
        <div>

        <header>

        </header>

        <section>
            {user ? <ChatPage/> : <SignIn/>}
        </section>

        </div>
    );
}


function SignIn() {
    const signInGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }
}

