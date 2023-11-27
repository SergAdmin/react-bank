const express = require('express')
const router = express.Router()

const { Balance } = require('../class/balance')

const { User } = require('../class/user')

const {
  NOTIFICATION_TEXT,
  NOTIFICATION_TYPE,
} = require('../const/notifications')

router.post('/receive', (req, res) => {
  try {
    //Отримуємо вхідні дані та перевіряємо на наявність

    const { token, sum, resEmail } = req.body

    if (!sum) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    if (!token) {
      return res.status(400).json({
        message: 'Не вдалося отримати токен',
      })
    }

    if (!resEmail) {
      return res.status(400).json({
        message: 'Будь ласка, оберіть спосіб оплати',
      })
    }

    // Намагаємось отримати користувача по токену

    const user = User.getUserByToken(token)

    if (!user) {
      return res.status(400).json({
        message: 'Користувачів не існує',
      })
    }

    // Намагаємось отримати залишки по токену

    const balance = Balance.getBalance(token)

    if (!balance) {
      return res.status(400).json({
        message: 'Помилка завантаження балансу',
      })
    }

    balance.add(sum)
    user.addTransaction(sum, 'receive', resEmail)
    user.addNotification(
      NOTIFICATION_TYPE.ANNOUNCE,
      NOTIFICATION_TEXT.RECEIVE,
    )
    return res.status(200).json({
      result: true,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
