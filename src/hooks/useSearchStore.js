import { create } from "zustand";

export const useSearchStore = create((set) => ({
  searchTerm: "",
  searchResults: [],
  searching: false,

  setSearchTerm: (term) =>
    set({
      searchTerm: term
    }),

  setSearchResults: (results) =>
    set({
      searchResults: results
    }),

  setSearching: (state) =>
    set({
      searching: state
    }),

  clearSearch: () =>
    set({
      searchTerm: "",
      searchResults: [],
      searching: false
    })
}));
