import { create } from "zustand";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export const useLibraryStore = create((set, get) => ({
  savedBooks: [],
  finishedBooks: [],
  loading: true,

  fetchLibrary: async (uid) => {
    if (!uid) {
      set({
        savedBooks: [],
        finishedBooks: [],
        loading: false
      });
      return;
    }

    set({ loading: true });

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      set({
        savedBooks: [],
        finishedBooks: [],
        loading: false
      });
      return;
    }

    const data = userSnap.data();
    const library = data.library || {};

    set({
      savedBooks: library.saved || [],
      finishedBooks: library.finished || [],
      loading: false
    });
  },

  addToLibrary: async (uid, bookSnapshot) => {
    if (!uid || !bookSnapshot) return;

    const { savedBooks } = get();
    const alreadySaved = savedBooks.some(
      (book) => book.id === bookSnapshot.id
    );

    if (alreadySaved) return;

    const updatedSaved = [...savedBooks, bookSnapshot];

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      "library.saved": updatedSaved
    });

    set({ savedBooks: updatedSaved });
  },

  markAsFinished: async (uid, bookSnapshot) => {
    if (!uid || !bookSnapshot) return;

    const { finishedBooks } = get();
    const alreadyFinished = finishedBooks.some(
      (book) => book.id === bookSnapshot.id
    );

    if (alreadyFinished) return;

    const updatedFinished = [...finishedBooks, bookSnapshot];

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      "library.finished": updatedFinished
    });

    set({ finishedBooks: updatedFinished });
  },

  clearLibrary: () => {
    set({
      savedBooks: [],
      finishedBooks: [],
      loading: true
    });
  }
}));
