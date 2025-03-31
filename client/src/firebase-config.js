import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA1QFlvVh9zMZQE6AGIesrmBDP92OrvENg",
    authDomain: "react-shop-449a3.firebaseapp.com",
    projectId: "react-shop-449a3",
    storageBucket: "react-shop-449a3.firebasestorage.app",
    messagingSenderId: "1091422163083",
    appId: "1:1091422163083:web:d833bb0e4a58bdb4cd448e",
    measurementId: "G-15TF528X79"
};


const app = initializeApp(firebaseConfig)
// save user online when refresh
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db };
export default app;
