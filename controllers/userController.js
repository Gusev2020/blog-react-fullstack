const { prisma } = require('../prisma/prisma-client')
const bcript = require('bcryptjs')
const jDantIcon = require('jdenticon')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return res
          .status(400)
          .json({ error: 'Пользователь с такой почтой уже есть' })
      }

      const hashPassword = await bcript.hash(password, 10)

      const png = jDantIcon.toPng(name, 200)
      const avatarName = `${name}_${Date.now()}.png`
      const avatarPath = path.join(__dirname, '/../uploads', avatarName)
      fs.writeFileSync(avatarPath, png)

      const user = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
          name,
          avatar: `/uploads/${avatarName}`,
        },
      })

      res.json(user)
    } catch (e) {
      console.error('Error in register', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        return res.status(400).json({ error: 'Неверный логин или пароль' })
      }

      const validPassword = await bcript.compare(password, user.password)

      if (!validPassword) {
        return res.status(400).json({ error: 'Неверный логин или пароль' })
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY)

      res.json({ token })
    } catch (e) {
      console.error('Login error', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params
    const userId = req.user.userId

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          folowers: true,
          following: true,
        },
      })

      if (!user) {
        res.status(404).json({ error: 'Пользователь не найдет' })
      }

      const isFollowing = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId: id }],
        },
      })

      res.json({ ...user, isFollowing: Boolean(isFollowing) })
    } catch (e) {
      console.error('Get current error', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params
    const { email, name, dataOfBirth, bio, location } = req.body

    let filePath

    if (req.file && req.file.path) {
      filePath = req.file.path
    }

    if (id !== req.user.userId) {
      return res.status(403).json({ error: 'Нет доступа' })
    }

    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email },
        })
        if (existingUser && existingUser.id !== id) {
          return res.status(400).json({ error: 'Почта уже используется' })
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          avatar: filePath ? `/${filePath}` : undefined,
          dataOfBirth: dataOfBirth || undefined,
          bio: bio || undefined,
          location: location || undefined,
        },
      })

      res.json(user)
    } catch (e) {
      console.error('Update user error', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
  currentUser: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.userId,
        },
        include: {
          folowers: {
            include: {
              follower: true,
            },
          },
          following: {
            include: {
              following: true,
            },
          },
        },
      })

      if (!user) {
        return res.status(400).json({ error: 'Пользователь не найден' })
      }

      res.json(user)
    } catch (e) {
      console.error('Get current error', e)
      res.status(500).json({ error: 'internal server error' })
    }
  },
}

module.exports = UserController
