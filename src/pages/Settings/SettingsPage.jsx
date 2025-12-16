import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useSubscriptionStore } from "../../hooks/useSubscriptionStore"
import { useSearchStore } from "../../hooks/useSearchStore"
import SearchResults from "../../components/SearchResults/SearchResults"
import "./SettingsPage.css"

export default function SettingsPage() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)
  const logout = useAuthStore((state) => state.logout)

  const {
    isSubscribed,
    planType,
    loading: subLoading,
    ready: subReady,
    fetchSubscriptionStatus,
    getPlanLabel,
  } = useSubscriptionStore()

  const searchResults = useSearchStore((state) => state.searchResults)

  useEffect(() => {
    if (user?.uid && !subReady) {
      fetchSubscriptionStatus(user.uid)
    }
  }, [user, subReady, fetchSubscriptionStatus])

  if (searchResults.length > 0) {
    return <SearchResults />
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  if (!user) {
    return (
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-card">
          <img
            src="/assets/login.png"
            alt="Login required"
            style={{
              maxWidth: "280px",
              display: "block",
              margin: "0 auto 24px",
            }}
          />

          <p
            className="settings-text"
            style={{ textAlign: "center" }}
          >
            Log in to your account to see your details.
          </p>

          <div style={{ textAlign: "center" }}>
            <button
              className="settings-button"
              onClick={() => openAuthModal(true)}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    )
  }

  const planLabel =
    typeof getPlanLabel === "function"
      ? getPlanLabel()
      : subLoading || !subReady
      ? "Loading..."
      : isSubscribed
      ? planType === "premium-plus"
        ? "Premium-plus"
        : "Premium"
      : "Basic (Free)"

  const showUpgradeButton =
    subReady && !subLoading && !isSubscribed

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-card">
        <h2 className="settings-section-title">
          Account
        </h2>
        <p className="settings-text">
          Email: {user.email}
        </p>
      </div>

      <div className="settings-card">
        <h2 className="settings-section-title">
          Subscription
        </h2>

        <p className="settings-text">
          Current Plan: {planLabel}
        </p>

        {showUpgradeButton ? (
          <button
            className="settings-button"
            onClick={() => navigate("/choose-plan")}
          >
            Upgrade to Premium
          </button>
        ) : null}

        {subReady && !subLoading && isSubscribed ? (
          <p className="settings-text">
            You are subscribed to{" "}
            {planType === "premium-plus"
              ? "Premium-plus"
              : "Premium"}
            .
          </p>
        ) : null}
      </div>

      <div className="settings-card">
        <button
          className="settings-button logout"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  )
}
