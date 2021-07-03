const Book = require("../models/BookModel");
const mongoose = require("mongoose");

const getCart = async (req, res, next) => {
  const { email } = req.body;
  try {
    const book = await Book.find({ cart: email });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const ClearCart = async (req, res, next) => {
  const { email } = req.body;
  try {
    const book = await Book.find({ cart: { $in: [email] } });
    await book.map((item) => item.cart.filter((item) => item !== email));
    res.status(200).json("Clear Cart");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const DelCart = async (req, res, next) => {
  const { email, id } = req.body;
  try {
    const book = await Book.findById(id);
    book.cart = await book.cart.filter((item) => item !== email);
    await book.save();
    res.status(200).json("Del Cart");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const AddCart = async (req, res, next) => {
  const { email, id } = req.body;
  try {
    const book = await Book.findById(id);
    await book.cart.push(email);
    await book.save();
    res.status(200).json("Add Cart");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getOneBook = async (req, res, next) => {
  const id = req.params.bookId;
  try {
    const book = await Book.findById(id);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const searchBook = async (req, res, next) => {
  const { city } = req.body;

  try {
    const books = await Book.find().or([
      { city: { $regex: city, $options: "i" } },
      { title: { $regex: city, $options: "i" } },
      { categoryId: { $regex: city, $options: "i" } }
    ]);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addBook = async (req, res, next) => {
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    author: req.body.author,
    status: req.body.status,
    language: req.body.language,
    city: req.body.city,
    summary: req.body.summary,
    price: req.body.price,
    entryDate: req.body.entryDate,
    bookImage: req.body.bookImage,
    categoryId: req.body.category,
    info: req.body.info
  });

  try {
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateBook = async (req, res, next) => {
  const id = req.params.bookId;
  mongoose.set("useFindAndModify", false);
  Book.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      author: req.body.author,
      status: req.body.status,
      language: req.body.language,
      city: req.body.city,
      price: req.body.price,
      summary: req.body.summary,
      entryDate: req.body.entryDate,
      bookImage: req.body.bookImage,
      categoryId: req.body.category,
      info: req.body.info
    },
    function (err, book) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({ message: "Book updated successfully", book });
      }
    }
  );
};

const deleteBook = async (req, res, next) => {
  const id = req.params.bookId;
  try {
    await Book.deleteOne({ _id: id });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = {
  getOneBook,
  getAllBooks,
  addBook,
  deleteBook,
  updateBook,
  searchBook,
  getCart,
  AddCart,
  DelCart,
  ClearCart
};
