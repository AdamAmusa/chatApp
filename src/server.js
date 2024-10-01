// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';
import 'firebase/auth'

import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import Login from "./Login";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";  // Auth and Google provider imports
import ChatPage from "./chatPage";
import SignUp from "./SignUp";
import { useEffect } from "react";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-UZBt0wfBSjX9LIKcmWvJ5EOzh4JtWR0",
    authDomain: "chat-e48d2.firebaseapp.com",
    projectId: "chat-e48d2",
    storageBucket: "chat-e48d2.appspot.com",
    messagingSenderId: "485655526487",
    appId: "1:485655526487:web:95eb688ead5ed43e0b7712",
    measurementId: "G-4CGDENJTGF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  // Initialize the Firebase app
const auth = getAuth(app);                  // Initialize Firebase Authentication
const analytics = getAnalytics(app);
const firestore = getFirestore(app);





export const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        // Await the sign-in process
        await signInWithPopup(auth, provider);
        console.log("User signed in successfully");

    } catch (error) {
        if (error.code === 'auth/cancelled-popup-request') {
            console.warn('Popup request cancelled:', error);
        } else {
            console.error('Error during sign-in:', error);
        }
    } finally {

    }
}




const useFetch = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
            if (user) {
                console.log("redirected")
                navigate("/chatpage")
            } else {
                console.log("No successful sign in");
            }
      
    }, [user]);
};

export default useFetch;





