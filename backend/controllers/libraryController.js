const Book = require("../models/Book");

const addBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      success: true,
      message: "Book added successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with ID: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with ID: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};


const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with ID: ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const searchBooks = async (req, res, next) => {
  try {
    const { title, author, q } = req.query;

    if (!title && !author && !q) {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query: title, author, or q",
      });
    }

    let query = {};

    if (q) {
      query = {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { author: { $regex: q, $options: "i" } },
        ],
      };
    } else {
      const conditions = [];
      if (title) conditions.push({ title: { $regex: title, $options: "i" } });
      if (author) conditions.push({ author: { $regex: author, $options: "i" } });
      query = conditions.length === 1 ? conditions[0] : { $or: conditions };
    }

    const books = await Book.find(query);

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found matching the search criteria",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
};