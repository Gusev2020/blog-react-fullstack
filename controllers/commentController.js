const { prisma } = require('../prisma/prisma-client')

const CommnetController = {
  createComment: async (req, res) => {
    const { postId, content } = req.body
    const userId = req.user.userId

    if(!postId || !content) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    try {
      const comment = await prisma.comment.create({
        data:{
          postId,
          userId,
          content
        }
      })

      res.json(comment)
    } catch(e) {
      console.error('Error in create comment', e)
      res.status(500).json({ error: 'internal server error' })
    }

  },
  deleteComment: async (req, res) => {
    res.send('deleteComment')
  },
}

module.exports = CommnetController
