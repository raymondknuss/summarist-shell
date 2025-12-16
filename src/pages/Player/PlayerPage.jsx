import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { getBookById } from "../../services/api"
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer"
import "../../components/AudioPlayer/AudioPlayer.css"
import "./PlayerPage.css"
import Skeleton from "../../components/Skeleton/Skeleton"
import { useSearchStore } from "../../hooks/useSearchStore"
import { useAuthStore } from "../../hooks/useAuthStore"
import { useSubscriptionStore } from "../../hooks/useSubscriptionStore"
import { useLibraryStore } from "../../hooks/useLibraryStore"
import SearchResults from "../../components/SearchResults/SearchResults"

export default function PlayerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { searchResults } = useSearchStore()
  const user = useAuthStore(state => state.user)
  const authLoading = useAuthStore(state => state.loading)

  const isSubscribed = useSubscriptionStore(state => state.isSubscribed)
  const subLoading = useSubscriptionStore(state => state.loading)
  const subReady = useSubscriptionStore(state => state.ready)

  const markAsFinished = useLibraryStore(state => state.markAsFinished)

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      navigate("/")
      return
    }

    let cancelled = false

    async function fetchData() {
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

    fetchData()

    return () => {
      cancelled = true
    }
  }, [id, user, authLoading, navigate])

  useEffect(() => {
    if (!book) return
    if (!book.subscriptionRequired) return
    if (!subReady || subLoading) return

    if (!isSubscribed) {
      navigate("/choose-plan")
    }
  }, [book, subReady, subLoading, isSubscribed, navigate])

  const handleFinished = useCallback(() => {
    if (!user || !book) return

    const bookSnapshot = {
      id: book.id,
      title: book.title,
      author: book.author,
      imageLink: book.imageLink,
      subscriptionRequired: book.subscriptionRequired
    }

    markAsFinished(user.uid, bookSnapshot)
  }, [user, book, markAsFinished])

  if (searchResults.length > 0) {
    return <SearchResults />
  }

  if (authLoading) {
    return (
      <div className="player-page-loading">
        <Skeleton width="80%" height="32px" />
        <Skeleton width="60%" height="20px" />
        <Skeleton width="100%" height="200px" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (loading || !book || (!subReady && book.subscriptionRequired)) {
    return (
      <div className="player-page-loading">
        <Skeleton width="80%" height="32px" />
        <Skeleton width="60%" height="20px" />
        <Skeleton width="100%" height="200px" />
      </div>
    )
  }

  if (book.subscriptionRequired && !isSubscribed) {
    return null
  }

  return (
    <div className="player-page-container">
      <div className="player-info">
        <h1 className="player-title">{book.title}</h1>
        <p className="player-author">{book.author}</p>
        <p className="player-summary" style={{ whiteSpace: "pre-line" }}>
          {book.summary}
        </p>
      </div>

      <AudioPlayer
        audioUrl={book.audioLink}
        bookId={book.id}
        onEnded={handleFinished}
      />
    </div>
  )
}
