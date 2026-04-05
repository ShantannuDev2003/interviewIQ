import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-49d0c.firebaseapp.com",
  projectId: "interviewiq-49d0c",
  storageBucket: "interviewiq-49d0c.firebasestorage.app",
  messagingSenderId: "847032360844",
  appId: "1:847032360844:web:f14aa315550b43e63b00a9"
};

const app = initializeApp(firebaseConfig);

const auth=getAuth(app);

const provider=new GoogleAuthProvider();

export {auth,provider}