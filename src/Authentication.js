import { useAuthState } from 'react-firebase-hooks/auth';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const signUpUser = async (email, password, displayName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Get the signed-in user information
            const user = userCredential.user;

            await updateProfile(user, { displayName });

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName,
                email,
                photoURL: null
            });

            await setDoc(doc(db, 'userChats', user.uid), {});

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
    
   export const signInUser = async (email, password) => {
        try {
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
    
    
    export const useFetch = () => {
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

    export const getLastConversation = async (userId) =>{
        console.log("Fetching last conversation for user:", userId);
        const lastConversation = localStorage.getItem('lastConversation');
        if (lastConversation) {
            return JSON.parse(lastConversation);
        }
        else{

        // Step 2: If not found, check Firestore
    try {
        const userChatsRef = doc(db, "userChats", userId);
        const userChatsSnap = await getDoc(userChatsRef);

        if (userChatsSnap.exists()) {
            const chatsData = userChatsSnap.data();
            const firstChatId = Object.keys(chatsData)?.[0] || null;

            if (firstChatId) {
                localStorage.setItem("lastConversation", JSON.stringify(firstChatId));
            }

            return firstChatId;
        }

        return null;
    } catch (error) {
        console.error("Error fetching userChats:", error);
        return null;
    }
    }
}

