const { prisma } = require('../prisma/prisma-client')

const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body
    const userId = req.user.userId

    if (!postId) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId },
      })

      if (existingLike) {
        return res.status(400).json({ error: 'Вы уже поставили лайк' })
      }

      const like = await prisma.like.create({
        data: {
          postId,
          userId,
        },
      })

      res.json(like)
    } catch (e) {
      console.error('Error like post', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  unLikePost: async (req, res) => {
    const { id } = req.params
    const userId = req.user.id

    if (!id) {
      return res.status(400).json({ error: 'Вы уже поставили дизлайк' })
    }

    try {
      const existingUnLike = await prisma.like.findFirst({
        where: { postId: id, userId },
      })

      if (!existingUnLike) {
        return res.status(400).json({ error: 'Вы уже поставили дизлайк' })
      }

      const unLike = await prisma.like.deleteMany({
        where: { postId: id, userId },
      })

      res.json(unLike)
    } catch (e) {
      console.error('Error like post', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
}

module.exports = LikeController
