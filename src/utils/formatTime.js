export default function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00"

  const minutes = Math.floor(seconds / 60)
  const remaining = Math.floor(seconds % 60)

  const padded = remaining < 10 ? "0" + remaining : remaining
  return minutes + ":" + padded
}
