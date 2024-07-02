// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8SQtnZHJr4JpwVOl3T2WNx7SRtGoOMnQ",
  authDomain: "auth-firebase-86791.firebaseapp.com",
  databaseURL: "https://auth-firebase-86791-default-rtdb.firebaseio.com",
  projectId: "auth-firebase-86791",
  storageBucket: "auth-firebase-86791.appspot.com",
  messagingSenderId: "989618083136",
  appId: "1:989618083136:web:6c083501345b976406d6a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db = getFirestore(app)
export default app