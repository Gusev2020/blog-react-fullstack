const express = require('express')
const router = express.Router()
const multer = require('multer')
const { UserController, PostController, CommnetController, LikeController, FollowController } = require('../controllers')
const authenticateToken = require('../middleware/auth')

// Где будем хранить файлы
const uploadDestination = 'uploads'

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, next) {
    next(null, file.originalname)
  },
})

const uploads = multer({ storage: storage })

// user routes
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.currentUser)
router.get('/users/:id', authenticateToken, UserController.getUserById)
router.put('/users/:id', authenticateToken, UserController.updateUser)

// post routes
router.post('/posts', authenticateToken, PostController.createPost)
router.get('/posts', authenticateToken, PostController.getAllPosts)
router.get('/posts/:id', authenticateToken, PostController.getpostById)
router.delete('/posts/:id', authenticateToken, PostController.deletePost)

// comments routes
router.post('/comments', authenticateToken, CommnetController.createComment)
router.delete('/comments/:id', authenticateToken, CommnetController.deleteComment)

// likes routes
router.post('/likes', authenticateToken, LikeController.likePost)
router.delete('/likes/:id', authenticateToken, LikeController.unLikePost)

// follows routes
router.post('/follows', authenticateToken, FollowController.followUser)
router.delete('/unfollows/:id', authenticateToken, FollowController.unFollowUser)

module.exports = router
