import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useSearchStore } from "../../hooks/useSearchStore";
import { searchBooks } from "../../services/api";
import "./SearchBar.css";

export default function SearchBar() {
  const { setSearchTerm, setSearchResults, setSearching, clearSearch } =
    useSearchStore();

  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedValue.trim() === "") {
      clearSearch();
      return;
    }

    const fetchData = async () => {
      setSearching(true);
      try {
        const results = await searchBooks(debouncedValue);
        setSearchResults(results);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setSearching(false);
        setSearchTerm(debouncedValue);
      }
    };

    fetchData();
  }, [debouncedValue, setSearchResults, setSearching, setSearchTerm, clearSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search by title or author"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
