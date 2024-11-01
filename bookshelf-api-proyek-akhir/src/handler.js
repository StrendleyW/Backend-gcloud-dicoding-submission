const { nanoid } = require("nanoid");
const books = require("./books");

//  Validasi menyimpan buku
const saveBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi properti `name`
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Validasi `readPage` tidak boleh lebih besar dari `pageCount`
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  // Buat ID buku
  const bookId = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.some((book) => book.bookId === bookId);

  // Validasi buku berhasil dimasukkan
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: bookId,
      },
    });
    response.code(201);
    return response;
  }

  // Jika gagal
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

//  Validasi menampilkan semua buku
const getAllBooks = (request, h) => {
  const { finished, reading, name } = request.query; // Mengambil query parameters

  let filteredBooks = books;

  // Filter berdasarkan 'finished' jika ada
  if (finished !== undefined) {
    const isFinished = finished === "1"; // Konversi string '1' menjadi boolean
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  // Filter berdasarkan 'reading' jika ada
  if (reading !== undefined) {
    const isReading = reading === "1"; // Konversi string '1' menjadi boolean
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  // Filter berdasarkan 'name' jika ada
  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()) // Mencocokkan dengan non-case sensitive
    );
  }

  const simplifiedBooks = filteredBooks.map(({ bookId, name, publisher }) => ({
    id: bookId,
    name,
    publisher,
  }));

  const response = h.response({
    status: "success",
    data: {
      books: simplifiedBooks,
    },
  });
  response.code(200);
  return response;
};

//  Validasi menampilkan detail buku
const getBookById = (request, h) => {
  const { bookId } = request.params;

  // Mencari buku berdasarkan ID
  const book = books.find((n) => n.bookId === bookId);

  // Validasi jika buku ditemukan
  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
        book: {
          id: book.bookId,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt,
        },
      },
    });
    response.code(200);
    return response;
  }

  // Validasi jika buku tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Validasi mengedit detail buku
const editBookById = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  // Validasi properti `name`
  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  // Validasi `readPage` tidak boleh lebih besar dari `pageCount`
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.bookId === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  // Validasi jika buku tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

//Valdiasi mengahpus buku
const deleteBookById = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.bookId === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  // Validasi jika Id tidak ditemukan
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  saveBook,
  getAllBooks,
  getBookById,
  editBookById,
  deleteBookById,
};
