export default function BookCard({ book, onClick }) {
  function handleClick() {
    if (onClick) {
      onClick(book.id);
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        position: "relative",
        width: "180px",
        minHeight: "260px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        padding: "12px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.04)"
      }}
    >
      {book.subscriptionRequired && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            padding: "4px 8px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            backgroundColor: "#f97316",
            color: "#ffffff"
          }}
        >
          Premium
        </div>
      )}

      {book.imageLink && (
        <img
          src={book.imageLink}
          alt={book.title}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "4px"
          }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "#111827"
          }}
        >
          {book.title}
        </h3>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#6b7280"
          }}
        >
          {book.author}
        </p>
      </div>
    </div>
  );
}
