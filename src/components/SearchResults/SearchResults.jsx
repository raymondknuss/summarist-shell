import { useSearchStore } from "../../hooks/useSearchStore";
import BookCard from "../BookCard/BookCard";
import Skeleton from "../Skeleton/Skeleton";
import "./SearchResults.css";
import { useNavigate } from "react-router-dom";

export default function SearchResults() {
  const { searchResults, searching, clearSearch } = useSearchStore();
  const navigate = useNavigate();

  if (searching) {
    return (
      <div className="search-results">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} />
        ))}
      </div>
    );
  }

  function handleSelect(id) {
    clearSearch();
    navigate(`/book/${id}`);
  }

  return (
    <div className="search-results">
      {searchResults.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={(id) => handleSelect(id)}
        />
      ))}
    </div>
  );
}
