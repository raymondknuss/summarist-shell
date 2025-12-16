import BookCard from "../BookCard/BookCard";

export default function BookRow({ title, books, onBookClick }) {
  return (
    <section
      style={{
        marginBottom: "2.5rem",
        width: "100%"
      }}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          marginBottom: "1rem",
          color: "#111827"
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
          width: "100%",
          justifyContent: "flex-start"
        }}
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={onBookClick}
          />
        ))}
      </div>
    </section>
  );
}
