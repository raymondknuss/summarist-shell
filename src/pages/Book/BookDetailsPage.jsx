import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getBookById } from "../../services/api"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useSubscriptionStore } from "../../hooks/useSubscriptionStore"
import { useLibraryStore } from "../../hooks/useLibraryStore"
import Skeleton from "../../components/Skeleton/Skeleton"
import "./BookDetailsPage.css"
import { useSearchStore } from "../../hooks/useSearchStore"
import SearchResults from "../../components/SearchResults/SearchResults"

export default function BookDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { searchResults } = useSearchStore()

  const user = useAuthStore((state) => state.user)
  const openAuthModal = useAuthStore((state) => state.openAuthModal)

  const isSubscribed = useSubscriptionStore((state) => state.isSubscribed)
  const subLoading = useSubscriptionStore((state) => state.loading)
  const subReady = useSubscriptionStore((state) => state.ready)

  const addToLibrary = useLibraryStore((state) => state.addToLibrary)

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setBook(null)
      setLoading(true)

      try {
        const data = await getBookById(id)
        if (cancelled) return
        setBook(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  if (searchResults.length > 0) {
    return <SearchResults />
  }

  if (loading || !book) {
    return (
      <div className="book-details-page">
        <div className="book-details-container">
          <Skeleton width="240px" height="360px" />
          <div className="book-info">
            <Skeleton width="70%" height="32px" />
            <Skeleton width="50%" height="24px" />
            <Skeleton width="40%" height="20px" />
            <Skeleton width="90%" height="20px" count={3} />
          </div>
        </div>
      </div>
    )
  }

  function handleAccess() {
    if (!user) {
      openAuthModal()
      return
    }

    if (book.subscriptionRequired && subReady && !isSubscribed) {
      navigate("/choose-plan")
      return
    }

    navigate(`/player/${book.id}`)
  }

  function handleAdd() {
    if (!user) {
      openAuthModal()
      return
    }

    const bookSnapshot = {
      id: book.id,
      title: book.title,
      author: book.author,
      imageLink: book.imageLink,
      subscriptionRequired: book.subscriptionRequired
    }

    addToLibrary(user.uid, bookSnapshot)
  }

  const accessDisabled =
    book.subscriptionRequired && !subReady

  return (
    <div className="book-details-page">
      <div className="book-details-container">
        <img src={book.imageLink} className="book-cover" alt={book.title} />

        <div className="book-info">
          <h1>{book.title}</h1>
          <h3>{book.subtitle}</h3>
          <p>{book.author}</p>

          <div className="tags">
            {book.tags &&
              book.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
          </div>

          <div className="buttons">
            <button onClick={handleAccess} disabled={accessDisabled}>
              Read
            </button>
            <button onClick={handleAccess} disabled={accessDisabled}>
              Listen
            </button>
            <button onClick={handleAdd}>
              Add to My Library
            </button>
          </div>

          <div className="section-box">
            <h2>Summary</h2>
            <p style={{ whiteSpace: "pre-line" }}>{book.summary}</p>
          </div>

          <div className="section-box">
            <h2>Key Ideas</h2>
            <p style={{ whiteSpace: "pre-line" }}>{book.keyIdeas}</p>
          </div>

          <div className="section-box">
            <h2>About the Author</h2>
            <p style={{ whiteSpace: "pre-line" }}>
              {book.authorDescription}
            </p>
          </div>

          <div className="section-box">
            <h2>Book Description</h2>
            <p style={{ whiteSpace: "pre-line" }}>
              {book.bookDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
