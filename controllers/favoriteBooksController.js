const FavoriteBook = require('../schemas/favoriteBook');

// GET /favoritebooks
const getAllBooks = async (req, res, next) => {
  /* 
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Get a list of all favorite books"
    #swagger.responses[200] = {
      description: "Favorite books retrieved successfully",
      schema: [
        {
          _id: "60d21b4667d0d8992e610c85",
          title: "Sample Book",
          author: "Author Name",
          year: 1999
        }
      ]
    }
    #swagger.responses[500] = { description: "Server error" }
  */
  try {
    const books = await FavoriteBook.find();
    res.status(200).json(books);
  } catch (err) {
    next(err);
  }
};

// GET /favoritebooks/:bookId
const getBookById = async (req, res, next) => {
  /* 
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Get a favorite book by ID"
    #swagger.parameters["bookId"] = {
      in: "path",
      required: true,
      type: "string",
      description: "Favorite Book ID"
    }
    #swagger.responses[200] = {
      description: "Favorite book retrieved successfully",
      schema: { $ref: "#/definitions/FavoriteBook" }
    }
    #swagger.responses[400] = { description: "Invalid book ID format" }
    #swagger.responses[404] = { description: "Book not found" }
  */
  try {
    const book = await FavoriteBook.findById(req.params.bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(book);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    next(err);
  }
};

// POST /favoritebooks (Protected)
const addBook = async (req, res, next) => {
  /* 
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Add a new favorite book (Protected: requires OAuth login)"
    #swagger.security = [{ "OAuth2": [] }]
    #swagger.parameters["body"] = {
      in: "body",
      required: true,
      schema: {
        $title: "The Pragmatic Programmer",
        $author: "Andrew Hunt",
        $year: 1999
      }
    }
    #swagger.responses[201] = { description: "Book created successfully" }
    #swagger.responses[400] = { description: "Validation error" }
    #swagger.responses[401] = { description: "Unauthorized — requires authentication" }
  */
  try {
    const { title, author, year } = req.body;
    const book = new FavoriteBook({ title, author, year });
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// POST /favoritebooks/createWithArray (Protected)
const createWithArray = async (req, res, next) => {
  /* 
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Add multiple favorite books at once (Protected: requires OAuth login)"
    #swagger.security = [{ "OAuth2": [] }]
    #swagger.parameters["body"] = {
      in: "body",
      required: true,
      schema: [
        { title: "Book 1", author: "Author 1", year: 2020 },
        { title: "Book 2", author: "Author 2", year: 2021 }
      ]
    }
    #swagger.responses[201] = { description: "Books created successfully" }
    #swagger.responses[400] = { description: "Validation error" }
    #swagger.responses[401] = { description: "Unauthorized — requires authentication" }
  */
  try {
    const saved = await FavoriteBook.insertMany(req.body, { ordered: true });
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// PUT /favoritebooks/:bookId (Protected)
const updateBook = async (req, res, next) => {
  /* 
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Update an existing favorite book (Protected: requires OAuth login)"
    #swagger.security = [{ "OAuth2": [] }]
    #swagger.parameters["bookId"] = {
      in: "path",
      required: true,
      type: "string",
      description: "Favorite Book ID"
    }
    #swagger.parameters["body"] = {
      in: "body",
      required: true,
      schema: {
        title: "Updated Title",
        author: "Updated Author",
        year: 2022
      }
    }
    #swagger.responses[200] = { description: "Book updated successfully" }
    #swagger.responses[400] = { description: "Validation error or bad ID" }
    #swagger.responses[404] = { description: "Book not found" }
    #swagger.responses[401] = { description: "Unauthorized — requires authentication" }
  */
  try {
    const updated = await FavoriteBook.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(updated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    next(err);
  }
};

// DELETE /favoritebooks/:bookId (Protected)
const deleteBook = async (req, res, next) => {
  /* 
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Delete a favorite book by ID (Protected: requires OAuth login)"
    #swagger.security = [{ "OAuth2": [] }]
    #swagger.parameters["bookId"] = {
      in: "path",
      required: true,
      type: "string",
      description: "Favorite Book ID"
    }
    #swagger.responses[200] = { description: "Book deleted successfully" }
    #swagger.responses[400] = { description: "Invalid ID format" }
    #swagger.responses[404] = { description: "Book not found" }
    #swagger.responses[401] = { description: "Unauthorized — requires authentication" }
  */
  try {
    const deleted = await FavoriteBook.findByIdAndDelete(req.params.bookId);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    next(err);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  createWithArray,
  updateBook,
  deleteBook,
};
