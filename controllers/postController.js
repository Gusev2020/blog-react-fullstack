const { prisma } = require('../prisma/prisma-client')

const PostController = {
  createPost: async (req, res) => {
    const { content } = req.body

    const authorId = req.user.userId

    if (!content) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    try {
      const post = await prisma.post.create({
        data: {
          content,
          authorId,
        },
      })

      res.json(post)
    } catch (e) {
      console.error('Error in create post', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  getAllPosts: async (req, res) => {

    const userId = req.user.userId

    try {
      const posts = await prisma.post.findMany({
        include: {
          likes: true,
          auhtor: true,
          comments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      const postWithLikeInfo = posts.map(post => ({
        ...post,
        likeByUser: post.likes.some(like => like.userId === userId)
      }))

      res.json(postWithLikeInfo)
    } catch(e) {
      console.error('Error in get all post', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  getpostById: async (req, res) => {
    res.send('get post by id')
  },
  deletePost: async (req, res) => {
    res.send('delete post')
  },
}

module.exports = PostController
