const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, required: true },
  language: { type: String, required: true },
  city: { type: String, required: true },
  summary: { type: String, required: true },
  price: { type: String, required: true },
  entryDate: { type: Date, required: true },
  bookImage: { type: String, require: true },
  categoryId: { type: String, ref: "Category", required: true },
  info: { type: String, require: true },
  cart: { type: Array, default: [] }
});

module.exports = mongoose.model("Book", bookSchema);
