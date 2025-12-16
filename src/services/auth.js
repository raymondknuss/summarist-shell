import { auth, db } from "./firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

export async function registerUser(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  const user = result.user

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    subscription: "basic"
  })

  return user
}

export async function loginUser(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function guestLogin() {
  const email = "guest@summarist.com"
  const password = "guestpassword123"
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function logoutUser() {
  await signOut(auth)
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, user => {
    callback(user)
  })
}
