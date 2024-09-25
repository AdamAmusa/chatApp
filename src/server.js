// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth';
import Login from "./Login";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";  // Auth and Google provider imports
import ChatPage from "./chatPage";

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





 export function signInGoogle(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth,provider);   
}


function Server() {
    const [user] = useAuthState(auth);
    return (
        <div>

        <header>

        </header>

        <section>
            {user ? <ChatPage/> : <Login/>}
        </section>

        </div>
    );

}

export { auth, firestore };





