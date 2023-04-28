import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDdD6eKWsA4vBGkFkg9o7Q-gKvFEjenDrU",
    authDomain: "bookio-4cd89.firebaseapp.com",
    projectId: "bookio-4cd89",
    storageBucket: "bookio-4cd89.appspot.com",
    messagingSenderId: "128301143987",
    appId: "1:128301143987:web:8060b6240ff30664b79dc6"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };