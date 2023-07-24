import express from 'express'
import { allCategories, createCategory, deleteCategory, singleCategory, updateCategory } from '../../controllers/categories/categoriesController.js'
import { isLogin } from './../../middlewares/isLogin.js';

const route = express.Router()

// Create Category Route
route.post('/',isLogin, createCategory)


// Get All Category Route
route.get('/', allCategories)


// Get Single Category Route
route.get('/:id', singleCategory)


// Update Category Route
route.put('/:id',isLogin, updateCategory)


// Delete Category Route
route.delete('/:id',isLogin, deleteCategory)


export default route