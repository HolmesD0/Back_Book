const Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

const getOneCategory = async (req, res, next) => {
  const id = req.params.categoryId;
  try {
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addCategory = async (req, res, next) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title
  });

  try {
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const updateCategory = async (req, res, next) => {
  const id = req.params.categoryId;
  mongoose.set("useFindAndModify", false);
  Category.findByIdAndUpdate(
    id,
    {
      title: req.body.title
    },
    function (err, category) {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res
          .status(200)
          .json({ message: "Category updated successfully", category });
      }
    }
  );
};

const deleteCategory = async (req, res, next) => {
  const id = req.params.categoryId;
  try {
    await Category.deleteOne({ _id: id });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

module.exports = {
  getOneCategory,
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory
};
