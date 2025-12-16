import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import AuthModal from "./components/AuthModal/AuthModal"
import Sidebar from "./components/Sidebar/Sidebar"
import SearchBar from "./components/SearchBar/SearchBar"
import { useAuthStore } from "./hooks/useAuthStore"
import { useSubscriptionStore } from "./hooks/useSubscriptionStore"
import "./Layout.css"

export default function Layout() {
  const location = useLocation()

  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const user = useAuthStore((state) => state.user)

  const fetchSubscriptionStatus =
    useSubscriptionStore((state) => state.fetchSubscriptionStatus)
  const clearSubscription =
    useSubscriptionStore((state) => state.clearSubscription)

  const hideUI =
    location.pathname === "/" || location.pathname === "/choose-plan"

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus(user.uid)
    } else {
      clearSubscription()
    }
  }, [user, fetchSubscriptionStatus, clearSubscription])

  useEffect(() => {
    const triggers = document.querySelectorAll("[data-login-trigger]")

    function handleClick() {
      openAuthModal()
    }

    triggers.forEach((el) => {
      el.addEventListener("click", handleClick)
    })

    return () => {
      triggers.forEach((el) => {
        el.removeEventListener("click", handleClick)
      })
    }
  }, [openAuthModal, location.pathname, user])

  return (
    <div className={`layout-container ${hideUI ? "no-sidebar" : ""}`}>
      <AuthModal />

      {!hideUI && <Sidebar />}

      <div className={`layout-main ${hideUI ? "layout-main--landing" : ""}`}>
        {!hideUI && <SearchBar />}

        <div className={`layout-content ${hideUI ? "layout-content--landing" : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
