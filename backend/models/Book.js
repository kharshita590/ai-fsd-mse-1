const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre/Category is required"],
      trim: true,
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
      trim: true,
    },
    publicationYear: {
      type: Number,
      min: [1000, "Invalid publication year"],
      max: [new Date().getFullYear(), "Publication year cannot be in the future"],
    },
    totalCopies: {
      type: Number,
      required: [true, "Total copies is required"],
      min: [1, "Total copies must be a positive number"],
    },
    availableCopies: {
      type: Number,
      min: [0, "Available copies cannot be negative"],
    },
    shelfLocation: {
      type: String,
      trim: true,
    },
    bookType: {
      type: String,
      enum: {
        values: ["Reference", "Circulating"],
        message: "Book type must be either Reference or Circulating",
      },
      default: "Circulating",
    },
    status: {
      type: String,
      enum: {
        values: ["Available", "Checked Out"],
        message: "Status must be Available or Checked Out",
      },
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", function (next) {
  if (this.availableCopies === undefined || this.availableCopies === null) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

bookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model("Book", bookSchema);