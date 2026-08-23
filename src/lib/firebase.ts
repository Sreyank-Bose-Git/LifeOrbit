import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import config from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(config) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app, config.firestoreDatabaseId || undefined);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateFirebaseProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  serverTimestamp,
};
export type { FirebaseUser };
