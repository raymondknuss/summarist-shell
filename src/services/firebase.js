import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyACMwpirKQ2149fRbhAG_XSjZMQnUUiVAE",
  authDomain: "summarist-daefd.firebaseapp.com",
  projectId: "summarist-daefd",
  storageBucket: "summarist-daefd.appspot.com",
  messagingSenderId: "409966474782",
  appId: "1:409966474782:web:53ce75ffb33a75faefe00f"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

setPersistence(auth, browserLocalPersistence)
