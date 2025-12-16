const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net";

async function getBooks(status) {
  const response = await fetch(`${BASE_URL}/getBooks?status=${status}`);
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
}

async function getSelectedBook() {
  const books = await getBooks("selected");
  return books;
}

async function getRecommendedBooks() {
  const books = await getBooks("recommended");
  return books;
}

async function getSuggestedBooks() {
  const books = await getBooks("suggested");
  return books;
}

async function getBookById(id) {
  const response = await fetch(`${BASE_URL}/getBook?id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch book details");
  }
  return response.json();
}

async function searchBooks(search) {
  const response = await fetch(
    `${BASE_URL}/getBooksByAuthorOrTitle?search=${search}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }
  return response.json();
}

export {
  getSelectedBook,
  getRecommendedBooks,
  getSuggestedBooks,
  getBookById,
  searchBooks
};
