import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import router from "./router"
import "./App.css"
import { useAuthStore } from "./hooks/useAuthStore"

export default function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener)

  useEffect(() => {
    initAuthListener()
  }, [initAuthListener])

  return <RouterProvider router={router} />
}
