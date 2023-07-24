import { appError } from "../../utils/appError.js";
import Category from "./../../models/CategoryMod/CategoryMod.js";

export const createCategory = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.userAuth });

    res.json({
      status: "Success",
      data: category,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const allCategories = async (req, res,next) => {
  try {
    const categories = await Category.find();

    res.json({
      status: "Success",
      data: categories,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const singleCategory = async (req, res,next) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);

    res.json({
      status: "Success",
      data: category,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const updateCategory = async (req, res,next) => {
  const categoryId = req.params.id;
  const { title } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true, runValidators: true }
    );

    res.json({
      status: "Success",
      data: updatedCategory,
    });
  } catch (error) {
    next(appError(error.message));
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    res.json({
      status: "Success",
      data: `Category id -> ${categoryId} of has been deleted`,
    });
  } catch (error) {
    next(appError(error.message));
  }
};
