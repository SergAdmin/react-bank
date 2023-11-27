const express = require('express')
const router = express.Router()

const { User } = require('../class/user')

router.post('/notification', (req, res) => {
  try {
    //Перевірка на наявність токена

    const { token } = req.body
    if (!token) {
      return res.status(400).json({
        message: 'Не вдалося отримати токен',
      })
    }

    //Намагаємось отримати користувача по токену

    const user = User.getUserByToken(token)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача не існує',
      })
    }

    //Намагаємось отримати операції по користувачу

    const notificationList = user.notifications

    if (!notificationList) {
      return res.status(400).json({
        message: 'Не вдалося завантажити список сповіщень',
      })
    } else {
      return res.status(200).json({
        notificationList: notificationList,
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
