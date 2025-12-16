import { create } from "zustand"
import { subscribeToAuthChanges, logoutUser } from "../services/auth"
import { useSubscriptionStore } from "./useSubscriptionStore"

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  authModalOpen: false,
  redirectPath: null,
  _listenerInitialized: false,

  setRedirectPath(path) {
    set({ redirectPath: path })
  },

  clearRedirectPath() {
    set({ redirectPath: null })
  },

  openAuthModal(path = null) {
    if (path) {
      set({ redirectPath: path })
    }
    set({ authModalOpen: true })
  },

  closeAuthModal() {
    set({ authModalOpen: false })
  },

  setUser(user) {
    set({ user })
  },

  async logout() {
    await logoutUser()
    useSubscriptionStore.getState().clearSubscription()
    set({ user: null, redirectPath: null })
  },

  initAuthListener() {
    if (get()._listenerInitialized) return
    set({ _listenerInitialized: true })

    subscribeToAuthChanges(async (user) => {
      set({ user })

      if (user) {
        await useSubscriptionStore
          .getState()
          .fetchSubscriptionStatus(user.uid)
      } else {
        useSubscriptionStore.getState().clearSubscription()
      }

      set({ loading: false })
    })
  },
}))
