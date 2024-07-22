let host;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  host = "http://localhost:4000";
} else {
  host = "";
}

// Authenticate
export const register_api = `${host}/api/auth/register`;
export const login_api = `${host}/api/auth/login`;
export const googleCallback_api = `${host}/api/auth/google/register`;

// books

export const addBook_api = `${host}/api/books/addBook`;
export const viewBook_img_api = `${host}/api/books/book_img`;
export const viewBook_api = `${host}/api/books`;
export const updateBook_api = `${host}/api/books/update`;
export const DeleteBook_api = `${host}/api/books/delete`;

// borrow and return a book

export const borrowBook_api = `${host}/api/books/borrow_book`;
export const returnBook_api = `${host}/api/books/return_book`;
