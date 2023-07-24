import express from 'express'
import { adminBlockUserCtrl, adminUnBlockUserCtrl, allUsersCtrl, blockUsersCtrl, deleteUserCtrl, followingCtrl, loginCtrl, registerCtrl, singleUserCtrl, unBlockUsersCtrl, unFollowingCtrl, updatePasswordCtrl, updateUserCtrl, uploadProfilePictureCtrl, whoViewedMyProfileCtrl } from '../../controllers/users/userController.js'
import { isLogin } from '../../middlewares/isLogin.js'
import { storage } from '../../config/cloudinary.js'
import multer from 'multer'
import { isAdmin } from '../../middlewares/isAdmin.js'

const userRoute = express.Router()

// Instance of multer

const upload = multer({storage})


// POST/api/v1/users
// Register Route
userRoute.post('/register', registerCtrl)

// POST/api/v1/users
// Login Route
userRoute.post('/login', loginCtrl)


// GET/api/v1/users
// Get All user Route
userRoute.get('/', allUsersCtrl)


// GET/api/v1/users/profile/
// Get Single User Route
userRoute.get('/profile/', isLogin ,singleUserCtrl)


// PUT/api/v1/users/
// Update User Route
userRoute.put('/',isLogin, updateUserCtrl)

// GET/api/v1/users/profile-viewer/:id
// Peofile Viewed by User Route
userRoute.get('/profile-viewer/:id',isLogin, whoViewedMyProfileCtrl)

// GET/api/v1/users/fallowing/:id
// Fallowing Route
userRoute.get('/fallowing/:id',isLogin, followingCtrl)

// GET/api/v1/users/unfallowing/:id
// Unfallowing Route
userRoute.get('/unfallowing/:id',isLogin, unFollowingCtrl)

// GET/api/v1/users/block/:id
// Block User Route
userRoute.get('/block/:id',isLogin, blockUsersCtrl)

// GET/api/v1/users/unblock/:id
// UnBlock User Route
userRoute.get('/unblock/:id',isLogin, unBlockUsersCtrl)

// PUT/api/v1/users/admin-block/:id
// Admin Block User Route
userRoute.put('/admin-block/:id',isLogin, isAdmin, adminBlockUserCtrl)

// PUT/api/v1/users/admin-unblock/:id
// Admin Un-Block User Route
userRoute.put('/admin-unblock/:id',isLogin, isAdmin, adminUnBlockUserCtrl)

// PUT/api/v1/users/update-password
// Update  User Route
userRoute.put('/update-password',isLogin, updatePasswordCtrl)

// POST/api/v1/users/profile-photo-upload
// Upload User Profile Route
userRoute.post('/profile-photo-upload',isLogin,upload.single('profile'), uploadProfilePictureCtrl)

// DELETE/api/v1/users/delete-account
// Delete Route
userRoute.delete('/delete-account',isLogin, deleteUserCtrl)


export default userRoute