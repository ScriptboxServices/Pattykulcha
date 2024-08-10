import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv0igezZbHAAjKztNHsFt44gLcwzuFReY",
  authDomain: "pattykulcha.firebaseapp.com",
  projectId: "pattykulcha",
  storageBucket: "pattykulcha.appspot.com",
  messagingSenderId: "942855896373",
  appId: "1:942855896373:web:0fab226eb380698510607c",
  measurementId: "G-TZBK3DHJXT"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

