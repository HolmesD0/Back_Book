const express = require("express");

const BookController = require("../controllers/BookController");
/* const checkAuth = require("../middlewares/check-auth"); */
const uploadMulter = require("../middlewares/multer");

const router = express.Router();

router.post("/", uploadMulter.single("bookImage"), BookController.addBook);
router.post("/search", BookController.searchBook);
router.post("/cart", BookController.getCart);
router.post("/addcart", BookController.AddCart);
router.post("/delcart", BookController.DelCart);
router.post("/clearcart", BookController.ClearCart);
router.get("/:bookId", BookController.getOneBook);
router.get("/", BookController.getAllBooks);
router.delete("/:bookId", BookController.deleteBook);
router.put(
  "/:bookId",
  uploadMulter.single("bookImage"),
  BookController.updateBook
);

module.exports = router;
