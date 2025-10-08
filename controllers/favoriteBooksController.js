const FavoriteBook = require('../schemas/favoriteBook');

// GET /favoritebooks
const getAllBooks = async (req, res, next) => {
  /* GET all favorite books
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Get a list of all favorite books"
    #swagger.responses[200] = {
      description: "Favorite books retrieved successfully",
      schema: [
        {
          _id: "60d21b4667d0d8992e610c85",
          title: "Sample Book",
          author: "Author Name",
          year: "1999"
        }
      ]
    }
  */
  try {
    const books = await FavoriteBook.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
};

// GET /favoritebooks/:bookId
const getBookById = async (req, res, next) => {
  /* GET single favorite book by ID
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Get a favorite book by ID"
    #swagger.parameters["bookId"] = {
      in: "path",
      required: true,
      type: "string",
      description: "Favorite Book ID"
    }
    #swagger.responses[200] = { description: "Favorite book retrieved successfully" }
    #swagger.responses[404] = { description: "Book not found" }
  */
  try {
    const book = await FavoriteBook.findById(req.params.bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

// POST /favoritebooks
const addBook = async (req, res, next) => {
  /* CREATE new favorite book
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Add a new favorite book"
    #swagger.parameters["body"] = {
      in: "body",
      description: "Favorite book data",
      required: true,
      schema: {
        $title: "The Pragmatic Programmer",
        $author: "Andrew Hunt",
        $year: "1999"
      }
    }
    #swagger.responses[201] = { description: "Book created successfully" }
    #swagger.responses[400] = { description: "Validation error" }
  */
  try {
    const { title, author, year } = req.body;
    const book = new FavoriteBook({ title, author, year });
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// POST /favoritebooks/createWithArray
const createWithArray = async (req, res, next) => {
  /* CREATE multiple favorite books from array
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Add multiple favorite books at once"
    #swagger.parameters["body"] = {
      in: "body",
      description: "Array of favorite books",
      required: true,
      schema: [
        { title: "Book 1", author: "Author 1", year: "2020" },
        { title: "Book 2", author: "Author 2", year: "2021" }
      ]
    }
    #swagger.responses[201] = { description: "Books created successfully" }
    #swagger.responses[400] = { description: "Validation error" }
  */
  try {
    const saved = await FavoriteBook.insertMany(req.body);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// POST /favoritebooks/createWithList
const createWithList = async (req, res, next) => {
  /* CREATE multiple favorite books from list
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Add multiple favorite books at once (list)"
    #swagger.parameters["body"] = {
      in: "body",
      description: "List of favorite books",
      required: true,
      schema: [
        { title: "Book 1", author: "Author 1", year: "2020" },
        { title: "Book 2", author: "Author 2", year: "2021" }
      ]
    }
    #swagger.responses[201] = { description: "Books created successfully" }
    #swagger.responses[400] = { description: "Validation error" }
  */
  try {
    const saved = await FavoriteBook.insertMany(req.body);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// PUT /favoritebooks/:bookId
const updateBook = async (req, res, next) => {
  /* UPDATE favorite book by ID
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Update an existing favorite book"
    #swagger.parameters["bookId"] = {
      in: "path",
      description: "Favorite Book ID",
      required: true,
      type: "string"
    }
    #swagger.parameters["body"] = {
      in: "body",
      description: "Updated favorite book data",
      required: true,
      schema: {
        title: "Updated Title",
        author: "Updated Author",
        year: "2022"
      }
    }
    #swagger.responses[200] = { description: "Book updated successfully" }
    #swagger.responses[400] = { description: "Validation error" }
    #swagger.responses[404] = { description: "Book not found" }
  */
  try {
    const updated = await FavoriteBook.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /favoritebooks/:bookId
const deleteBook = async (req, res, next) => {
  /* DELETE favorite book by ID
    #swagger.tags = ["FavoriteBooks"]
    #swagger.description = "Delete a favorite book by ID"
    #swagger.parameters["bookId"] = {
      in: "path",
      required: true,
      type: "string",
      description: "Favorite Book ID"
    }
    #swagger.responses[200] = { description: "Book deleted successfully" }
    #swagger.responses[404] = { description: "Book not found" }
  */
  try {
    const deleted = await FavoriteBook.findByIdAndDelete(req.params.bookId);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  createWithArray,
  createWithList,
  updateBook,
  deleteBook,
};
