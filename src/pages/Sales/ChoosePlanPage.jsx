import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { doc, setDoc } from "firebase/firestore"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useSubscriptionStore } from "../../hooks/useSubscriptionStore"
import { db } from "../../services/firebase"
import "./ChoosePlanPage.css"

export default function ChoosePlanPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const fetchSubscriptionStatus = useSubscriptionStore(
    (state) => state.fetchSubscriptionStatus
  )

  const [billing, setBilling] = useState("yearly")
  const [openIndex, setOpenIndex] = useState(null)

  async function handleSubscribe() {
    if (!user) {
      navigate("/")
      return
    }

    const userRef = doc(db, "users", user.uid)

    await setDoc(
      userRef,
      {
        subscriptionStatus: "active",
        subscriptionPlan: billing
      },
      { merge: true }
    )

    await fetchSubscriptionStatus(user.uid)
    navigate("/settings")
  }

  function toggleAccordion(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  const price =
    billing === "yearly" ? "$99.99 / year" : "$9.99 / month"

  const priceSubtext =
    billing === "yearly"
      ? "7-day free trial included"
      : "No free trial"

  return (
    <div className="choose-plan-page">
      <div className="choose-plan-card">
        <div className="choose-plan-header">
          <h1 className="choose-plan-title">
            Choose the plan that fits you
          </h1>
          <p className="choose-plan-subtitle">
            Unlock unlimited access to premium summaries
          </p>
        </div>

        <div className="choose-plan-toggle-section">
          <div className="choose-plan-toggle">
            <button
              className={`choose-plan-toggle-button ${
                billing === "yearly" ? "active" : ""
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
              <span className="choose-plan-badge">
                Best Value
              </span>
            </button>

            <button
              className={`choose-plan-toggle-button ${
                billing === "monthly" ? "active" : ""
              }`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="choose-plan-pricing">
          <div className="choose-plan-price">{price}</div>
          <div className="choose-plan-price-sub">
            {priceSubtext}
          </div>

          <ul className="choose-plan-benefits">
            <li>Unlimited book summaries</li>
            <li>Audio & text formats</li>
            <li>Premium-only titles</li>
            <li>Cancel anytime</li>
          </ul>
        </div>

        <div className="choose-plan-accordion">
          <div className="choose-plan-accordion-item">
            <button
              className="choose-plan-accordion-header"
              onClick={() => toggleAccordion(0)}
            >
              How does the free trial work?
              <span className="choose-plan-accordion-icon">
                {openIndex === 0 ? "−" : "+"}
              </span>
            </button>

            {openIndex === 0 && (
              <div className="choose-plan-accordion-body">
                Start your 7-day free trial with the yearly plan.
                You won’t be charged if you cancel before it ends.
                Billing begins once the trial period concludes.
              </div>
            )}
          </div>

          <div className="choose-plan-accordion-item">
            <button
              className="choose-plan-accordion-header"
              onClick={() => toggleAccordion(1)}
            >
              Can I switch plans later?
              <span className="choose-plan-accordion-icon">
                {openIndex === 1 ? "−" : "+"}
              </span>
            </button>

            {openIndex === 1 && (
              <div className="choose-plan-accordion-body">
                You can switch from monthly to yearly once the
                current billing period ends. Switching from
                yearly to monthly is not supported.
              </div>
            )}
          </div>

          <div className="choose-plan-accordion-item">
            <button
              className="choose-plan-accordion-header"
              onClick={() => toggleAccordion(2)}
            >
              What does the Premium plan include?
              <span className="choose-plan-accordion-icon">
                {openIndex === 2 ? "−" : "+"}
              </span>
            </button>

            {openIndex === 2 && (
              <div className="choose-plan-accordion-body">
                Premium provides unlimited access to all book
                summaries, including exclusive premium titles.
                Enjoy both text and audio formats and learn at
                your own pace.
              </div>
            )}
          </div>

          <div className="choose-plan-accordion-item">
            <button
              className="choose-plan-accordion-header"
              onClick={() => toggleAccordion(3)}
            >
              Can I cancel my subscription?
              <span className="choose-plan-accordion-icon">
                {openIndex === 3 ? "−" : "+"}
              </span>
            </button>

            {openIndex === 3 && (
              <div className="choose-plan-accordion-body">
                You can cancel at any time. Canceling before
                the trial ends prevents any charges. After the
                trial, cancellation stops future billing.
              </div>
            )}
          </div>
        </div>

        <div className="choose-plan-footer">
          <button
            className="choose-plan-continue-button"
            onClick={handleSubscribe}
          >
            {billing === "yearly"
              ? "Start your free 7-day trial"
              : "Continue with Monthly"}
          </button>

          <p className="choose-plan-legal">
            Cancel anytime before trial ends and you won’t be charged.
          </p>
        </div>
      </div>
    </div>
  )
}
