const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const errorHandler = require("./middlewares/errorhandler");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library Management System API is running",
    version: "1.0.0",
    endpoints: {
      addBook:     "POST /books",
      getAllBooks:  "GET /books",
      getBookById: "GET  /books/:id",
      updateBook:  "PUT  /books/:id",
      deleteBook:  "DELETE /books/:id",
      searchBooks: "GET    /books/search?title=xyz  OR  ?author=xyz  OR  ?q=xyz",
    },
  });
});

app.use("/books", bookRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});