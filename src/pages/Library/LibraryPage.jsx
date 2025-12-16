import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useLibraryStore } from "../../hooks/useLibraryStore"
import BookCard from "../../components/BookCard/BookCard"
import Skeleton from "../../components/Skeleton/Skeleton"

export default function LibraryPage() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)

  const {
    savedBooks,
    finishedBooks,
    loading,
    fetchLibrary
  } = useLibraryStore()

  useEffect(() => {
    if (user) {
      fetchLibrary(user.uid)
    }
  }, [user, fetchLibrary])

  function handleNavigate(bookId) {
    navigate(`/book/${bookId}`)
  }

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>My Library</h1>
        <p>You need to be logged in to view your library.</p>
        <button onClick={openAuthModal}>Log In</button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>My Library</h1>

        <h2>Saved Books</h2>
        <Skeleton width="100%" height="200px" />

        <h2 style={{ marginTop: "2rem" }}>Finished Books</h2>
        <Skeleton width="100%" height="200px" />
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>My Library</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>Saved Books</h2>

        {savedBooks.length === 0 ? (
          <p>You haven’t saved any books yet.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {savedBooks.map((book) => (
              <div
                key={book.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleNavigate(book.id)}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "3rem" }}>
        <h2>Finished Books</h2>

        {finishedBooks.length === 0 ? (
          <p>You haven’t finished any books yet.</p>
        ) : (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {finishedBooks.map((book) => (
              <div
                key={book.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleNavigate(book.id)}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
