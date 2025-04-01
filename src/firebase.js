import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC1smiRhIsdV03sh0kuzAFybqBLDylrQa0",
    authDomain: "toko-rfpc.firebaseapp.com",
    projectId: "toko-rfpc",
    storageBucket: "toko-rfpc.firebasestorage.app",
    messagingSenderId: "527792196219",
    appId: "1:527792196219:web:0902e02d0c9d1c6fd1f0de",
    measurementId: "G-020CHM3DE0"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, doc, getDoc};
