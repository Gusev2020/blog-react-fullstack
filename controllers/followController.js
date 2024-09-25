const { prisma } = require('../prisma/prisma-client')
const { connect } = require('../routes')

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body
    const userId = req.user.userId

    if (!followingId) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    if (followingId === userId) {
      return res
        .status(500)
        .json({ error: 'Вы не можете подписаться на самого себя' })
    }

    try {
      const existingFollow = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId }],
        },
      })

      if (existingFollow) {
        return res.status(400).json({ error: 'Вы уже подписаны' })
      }

      const follow = await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      })

      res.status(201).json({ message: 'Подписка успешно создана' })
    } catch (e) {
      console.error('Error follows', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  unFollowUser: async (req, res) => {
    const { followingId } = req.body
    const userId = req.user.userId
    try {
      const follows = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId }],
        },
      })

      if (!follows) {
        return res.status(404).json({ error: 'Вы не подписаны' })
      }

      await prisma.follows.delete({ where: { id: follows.id } })
      res.status(201).json({ message: 'Подписка отменена' })
    } catch (e) {
      console.error('Error unfollows', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
}

module.exports = FollowController
