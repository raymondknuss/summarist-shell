import { create } from "zustand"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../services/firebase"

export const useSubscriptionStore = create((set, get) => ({
  isSubscribed: false,
  planType: null,
  loading: false,
  ready: false,

  clearSubscription() {
    set({
      isSubscribed: false,
      planType: null,
      loading: false,
      ready: false
    })
  },

  async fetchSubscriptionStatus(uid) {
    if (!uid) {
      set({
        isSubscribed: false,
        planType: null,
        loading: false,
        ready: true
      })
      return
    }

    set({ loading: true, ready: false })

    try {
      const userRef = doc(db, "users", uid)
      const snap = await getDoc(userRef)

      if (!snap.exists()) {
        set({
          isSubscribed: false,
          planType: null,
          loading: false,
          ready: true
        })
        return
      }

      const data = snap.data()

      if (data.subscriptionStatus !== "active") {
        set({
          isSubscribed: false,
          planType: null,
          loading: false,
          ready: true
        })
        return
      }

      set({
        isSubscribed: true,
        planType:
          data.subscriptionPlan === "yearly"
            ? "premium-plus"
            : "premium",
        loading: false,
        ready: true
      })
    } catch (err) {
      set({
        isSubscribed: false,
        planType: null,
        loading: false,
        ready: true
      })
    }
  },

  getPlanLabel() {
    const { ready, loading, isSubscribed, planType } = get()

    if (!ready || loading) return "Loading..."
    if (!isSubscribed) return "Basic (Free)"
    if (planType === "premium-plus") return "Premium Plus"
    return "Premium"
  }
}))
