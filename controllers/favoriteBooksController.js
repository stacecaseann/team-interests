const FavoriteBook = require('../schemas/favoriteBook'); // adjust path if needed

// GET /favoritebooks
const getAllBooks = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Get all favorite books'
  // #swagger.responses[200] = { description: 'List of favorite books' }
  try {
    const books = await FavoriteBook.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /favoritebooks/:bookId
const getBookById = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Get a favorite book by ID'
  // #swagger.parameters['bookId'] = { description: 'The ID of the book to retrieve.' }
  // #swagger.responses[200] = { description: 'A favorite book' }
  // #swagger.responses[404] = { description: 'Book not found' }
  try {
    const book = await FavoriteBook.findById(req.params.bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /favoritebooks
const addBook = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Add a new favorite book'
  // #swagger.parameters['book'] = { in: 'body', description: 'The book to create.', schema: { type: 'object', properties: { title: { type: 'string' }, author: { type: 'string' }, year: { type: 'string' } } } }
  // #swagger.responses[201] = { description: 'Book created' }
  // #swagger.responses[400] = { description: 'Bad request' }
  try {
    const { title, author, year } = req.body;
    const book = new FavoriteBook({ title, author, year });
    const saved = await book.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /favoritebooks/createWithArray
const createWithArray = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Add multiple favorite books from an array'
  // #swagger.parameters['books'] = { in: 'body', description: 'Array of books to create.', schema: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, author: { type: 'string' }, year: { type: 'string' } } } } }
  // #swagger.responses[201] = { description: 'Books created' }
  try {
    const saved = await FavoriteBook.insertMany(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// POST /favoritebooks/createWithList (same as above)
const createWithList = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Add multiple favorite books from a list'
  // #swagger.parameters['books'] = { in: 'body', description: 'List of books to create.', schema: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, author: { type: 'string' }, year: { type: 'string' } } } } }
  // #swagger.responses[201] = { description: 'Books created' }
  try {
    const saved = await FavoriteBook.insertMany(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /favoritebooks/:bookId
const updateBook = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Update a favorite book by ID'
  // #swagger.parameters['bookId'] = { description: 'The ID of the book to update.' }
  // #swagger.parameters['book'] = { in: 'body', description: 'The book data to update.', schema: { type: 'object', properties: { title: { type: 'string' }, author: { type: 'string' }, year: { type: 'string' } } } }
  // #swagger.responses[200] = { description: 'Book updated' }
  // #swagger.responses[404] = { description: 'Book not found' }
  try {
    const updated = await FavoriteBook.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true },
    );
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /favoritebooks/:bookId
const deleteBook = async (req, res) => {
  // #swagger.tags = ['FavoriteBooks']
  // #swagger.summary = 'Delete a favorite book by ID'
  // #swagger.parameters['bookId'] = { description: 'The ID of the book to delete.' }
  // #swagger.responses[200] = { description: 'Book deleted' }
  // #swagger.responses[404] = { description: 'Book not found' }
  try {
    const deleted = await FavoriteBook.findByIdAndDelete(req.params.bookId);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
