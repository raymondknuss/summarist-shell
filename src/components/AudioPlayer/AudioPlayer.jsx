import { useEffect, useRef, useState } from "react"
import formatTime from "../../utils/formatTime"

export default function AudioPlayer({ audioUrl, bookId, onEnded }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current

    function loaded() {
      setDuration(audio.duration)
    }

    function timeUpdate() {
      setCurrentTime(audio.currentTime)
    }

    function ended() {
      setIsPlaying(false)
      if (onEnded) {
        onEnded()
      }
    }

    audio.addEventListener("loadedmetadata", loaded)
    audio.addEventListener("timeupdate", timeUpdate)
    audio.addEventListener("ended", ended)

    return () => {
      audio.removeEventListener("loadedmetadata", loaded)
      audio.removeEventListener("timeupdate", timeUpdate)
      audio.removeEventListener("ended", ended)
    }
  }, [onEnded])

  function togglePlay() {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  function seek(e) {
    const rect = e.target.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const percentage = offsetX / rect.width
    const newTime = percentage * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  function skipForward() {
    const audio = audioRef.current
    audio.currentTime = Math.min(audio.currentTime + 10, duration)
  }

  function skipBackward() {
    const audio = audioRef.current
    audio.currentTime = Math.max(audio.currentTime - 10, 0)
  }

  return (
    <div className="audio-player-container">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="audio-controls">
        <button className="audio-btn" onClick={skipBackward}>-10</button>
        <button className="audio-btn play-btn" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button className="audio-btn" onClick={skipForward}>+10</button>
      </div>

      <div className="timeline-container" onClick={seek}>
        <div className="timeline-bg"></div>
        <div
          className="timeline-progress"
          style={{
            width: duration
              ? `${(currentTime / duration) * 100}%`
              : "0%"
          }}
        ></div>
      </div>

      <div className="time-display">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
