const FavoriteBook = require('../schemas/favoriteBook'); // adjust path if needed

/**
 * @swagger
 * tags:
 *   name: FavoriteBooks
 *   description: Manage users' favorite books
 */

// GET /favoritebooks
/**
 * @swagger
 * /favoritebooks:
 *   get:
 *     summary: Get all favorite books
 *     tags: [FavoriteBooks]
 *     responses:
 *       200:
 *         description: List of favorite books
 */
const getAllBooks = async (req, res) => {
    try {
        const books = await FavoriteBook.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /favoritebooks/:bookId
/**
 * @swagger
 * /favoritebooks/{bookId}:
 *   get:
 *     summary: Get a favorite book by ID
 *     tags: [FavoriteBooks]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A favorite book
 *       404:
 *         description: Book not found
 */
const getBookById = async (req, res) => {
    try {
        const book = await FavoriteBook.findById(req.params.bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /favoritebooks
/**
 * @swagger
 * /favoritebooks:
 *   post:
 *     summary: Add a new favorite book
 *     tags: [FavoriteBooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Bad request
 */
const addBook = async (req, res) => {
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
/**
 * @swagger
 * /favoritebooks/createWithArray:
 *   post:
 *     summary: Add multiple favorite books from an array
 *     tags: [FavoriteBooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 title: { type: string }
 *                 author: { type: string }
 *                 year: { type: string }
 *     responses:
 *       201:
 *         description: Books created
 */
const createWithArray = async (req, res) => {
    try {
        const saved = await FavoriteBook.insertMany(req.body);
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /favoritebooks/createWithList (same as above)
const createWithList = async (req, res) => {
    try {
        const saved = await FavoriteBook.insertMany(req.body);
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /favoritebooks/:bookId
/**
 * @swagger
 * /favoritebooks/{bookId}:
 *   put:
 *     summary: Update a favorite book by ID
 *     tags: [FavoriteBooks]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               year: { type: string }
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 */
const updateBook = async (req, res) => {
    try {
        const updated = await FavoriteBook.findByIdAndUpdate(
            req.params.bookId,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Book not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /favoritebooks/:bookId
/**
 * @swagger
 * /favoritebooks/{bookId}:
 *   delete:
 *     summary: Delete a favorite book by ID
 *     tags: [FavoriteBooks]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
const deleteBook = async (req, res) => {
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
    deleteBook
};
