// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";  // Auth and Google provider imports
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getFirestore} from "firebase/firestore";
import {doc, setDoc } from "firebase/firestore";


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
const db = getFirestore(app);

export const signUpUser = async(email, password, displayName) =>{
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Get the signed-in user information
        const user = userCredential.user;


        await setDoc(doc(db, 'users', user.uid),{
            displayName,
            email,
            photoURL: null
        });

        // Return success and user info
        return {
            success: true,
            user: user,
        };

    } catch (error) {
        console.log(error.code);
        // Return the error details
        return {
            success: false,
            errorCode: error.code,
            errorMessage: error.message,
        };
    }
};

export const signInUser = async (email, password) =>{
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Get the signed-in user information
        const user = userCredential.user;

        // Return success and user info
        return {
            success: true,
            user: user,
        };

    } catch (error) {
        console.log(error.code);
        // Return the error details
        return {
            success: false,
            errorCode: error.code,
            errorMessage: error.message,
        };
    }
};

export const usesignInGoogle = async () => {
    
    const provider = new GoogleAuthProvider();
    try {
        // Await the sign-in process
        signInWithPopup(auth, provider);
        console.log("User signed in successfully");

    } catch (error) {
        const errorCode = error.code;
      const errorMessage = error.message;
    }
}



const useFetch = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            console.log("redirected" + user);
            navigate("/chatpage")
        } else {
            console.log("No successful sign in");

        }

    }, [user]);
};


export const useSignOut = () => {
    const navigate = useNavigate();

    const signOutUser = async () => {
        if (auth.currentUser) {
            await auth.signOut();
            navigate("/login");
        }
    };
    return signOutUser;


}

export { app, auth, db, useFetch} ;





