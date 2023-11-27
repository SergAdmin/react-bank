const express = require('express')

const router = express.Router()

const { User } = require('../class/user.js')

const {
  NOTIFICATION_TEXT,
  NOTIFICATION_TYPE,
} = require('../const/notifications')

//////////////////////////////

router.post('/settings-email', (req, res) => {
  try {
    const { token, email } = req.body

    if (!token || !email) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    const user = User.getUserByToken(token)

    if (!user) {
      return res.status(400).json({
        message:
          'Користувача з такою електронною поштою не існує',
      })
    }

    user.email = email

    if (user.email !== email) {
      return res.status(400).json({
        message:
          'Не вдалося змінити адресу електронної пошти',
      })
    }

    user.addNotification(
      NOTIFICATION_TYPE.WARNING,
      NOTIFICATION_TEXT.EMAIL,
    )

    return res.status(200).json({
      email: user.email,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

//////////////////////////////////

router.post('/settings-password', (req, res) => {
  try {
    const { password, token } = req.body

    if (!password || !token) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    const user = User.getUserByToken(token)

    if (!user) {
      return res.status(400).json({
        message:
          'Користувача з відстійною електронною поштою не існує',
      })
    }

    if (user.password === password) {
      return res.status(400).json({
        message: 'Ваш пароль той самий',
      })
    } else {
      user.password = password

      if (user.password !== password) {
        return res.status(400).json({
          message: 'Не вдалося змінити пароль',
        })
      }

      user.addNotification(
        NOTIFICATION_TYPE.WARNING,
        NOTIFICATION_TEXT.PASSWORD,
      )

      return res.status(200).json({
        password: user.password,
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
