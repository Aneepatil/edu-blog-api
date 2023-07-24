import express from 'express'
import { createComment, deleteComment, updateComment } from '../../controllers/comments/commentController.js'
import { isLogin } from '../../middlewares/isLogin.js'

const route = express.Router()

// Create Comment Route
route.post('/:id',isLogin, createComment)


// // Get All Comment Route
// route.get('/',isLogin, allComments)


// // Get Single Comment Route
// route.get('/:id',isLogin, singleComment)


// Update Comment Route
route.put('/:id',isLogin, updateComment)


// Delete Comment Route
route.delete('/:id',isLogin, deleteComment)


export default route