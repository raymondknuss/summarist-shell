import { useState } from "react"
import { useAuthStore } from "../../hooks/useAuthStore"
import { registerUser, loginUser, guestLogin } from "../../services/auth"
import styles from "./AuthModal.module.css"
import { useNavigate } from "react-router-dom"

export default function AuthModal() {
  const navigate = useNavigate()

  const {
    authModalOpen,
    closeAuthModal,
    setUser,
    redirectPath,
    clearRedirectPath
  } = useAuthStore()

  const [form, setForm] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  if (!authModalOpen) return null

  function formatError(err) {
    if (!err) return "Something went wrong"
    if (typeof err === "string") return err
    if (err.message) return err.message
    return "Something went wrong"
  }

  async function handleAuth() {
    setError("")
    try {
      let user
      if (form === "login") {
        user = await loginUser(email, password)
      } else {
        user = await registerUser(email, password)
      }

      setUser(user)
      const path = redirectPath || "/for-you"
      clearRedirectPath()
      closeAuthModal()
      navigate(path)
    } catch (err) {
      setError(formatError(err))
    }
  }

  async function handleGuest() {
    setError("")
    try {
      const user = await guestLogin()
      setUser(user)
      const path = redirectPath || "/for-you"
      clearRedirectPath()
      closeAuthModal()
      navigate(path)
    } catch (err) {
      setError(formatError(err))
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{form === "login" ? "Login" : "Register"}</h2>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleAuth}>
          {form === "login" ? "Login" : "Register"}
        </button>

        <button onClick={handleGuest} className={styles.guest}>
          Continue as Guest
        </button>

        <p
          onClick={() => setForm(form === "login" ? "register" : "login")}
          className={styles.switch}
        >
          {form === "login" ? "Need an account?" : "Already registered?"}
        </p>

        <button onClick={closeAuthModal} className={styles.close}>×</button>
      </div>
    </div>
  )
}
