const { prisma } = require('../prisma/prisma-client')


const PostController = {
  createPost: async (req, res)=>{
    const { content } = req.body

    const authorId = req.user.userId

    if(!content) {
      return res
      .status(400)
      .json({ error: 'Все поля обязательны' })
    }

    try {

      const post = await prisma.post.create({
        data: {
          content,
          authorId
        }
      })

      res.json(post)

    } catch(e) {
      console.error('Error in create post', e)
      res.status(500).json({ error: 'internal server error' })
    }

  },
  getAllPosts: async (req, res)=>{
    res.send('get all posts')
  },
  getpostById: async (req, res)=>{
    res.send('get post by id')
  },
  deletePost: async (req, res)=>{
    res.send('delete post')
  },

}

module.exports = PostController
