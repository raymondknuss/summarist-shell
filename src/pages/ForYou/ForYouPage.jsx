import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSelectedBook,
  getRecommendedBooks,
  getSuggestedBooks
} from "../../services/api";
import BookRow from "../../components/BookRow/BookRow";
import Skeleton from "../../components/Skeleton/Skeleton";
import { useSearchStore } from "../../hooks/useSearchStore";
import SearchResults from "../../components/SearchResults/SearchResults";

export default function ForYouPage() {
  const { searchResults } = useSearchStore();

  const [selected, setSelected] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorMessage("");

      try {
        const [selectedData, recommendedData, suggestedData] = await Promise.all([
          getSelectedBook(),
          getRecommendedBooks(),
          getSuggestedBooks()
        ]);

        const firstSelected =
          selectedData && Array.isArray(selectedData) && selectedData.length > 0
            ? selectedData[0]
            : null;

        setSelected(firstSelected);
        setRecommended(recommendedData || []);
        setSuggested(suggestedData || []);
      } catch (error) {
        setErrorMessage("Something went wrong loading your books.");
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  function handleBookClick(id) {
    navigate(`/book/${id}`);
  }

  if (searchResults.length > 0) {
    return <SearchResults />;
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", marginTop: "1rem" }}>
        <Skeleton count={1} />
        <Skeleton count={4} />
        <Skeleton count={4} />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", marginTop: "1rem" }}>
      {errorMessage && (
        <p
          style={{
            marginBottom: "1rem",
            color: "#b91c1c",
            fontSize: "0.9rem"
          }}
        >
          {errorMessage}
        </p>
      )}

      {selected && (
        <BookRow
          title="Selected For You"
          books={[selected]}
          onBookClick={handleBookClick}
        />
      )}

      {recommended.length > 0 && (
        <BookRow
          title="Recommended For You"
          books={recommended}
          onBookClick={handleBookClick}
        />
      )}

      {suggested.length > 0 && (
        <BookRow
          title="Suggested For You"
          books={suggested}
          onBookClick={handleBookClick}
        />
      )}
    </div>
  );
}
