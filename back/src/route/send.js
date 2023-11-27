const express = require('express')
const router = express.Router()

const { Balance } = require('../class/balance.js')
const { User } = require('../class/user.js')

const {
  NOTIFICATION_TEXT,
  NOTIFICATION_TYPE,
} = require('../const/notifications')

//////////////////////////
router.post('/send', (req, res) => {
  try {
    const { email, sum, token } = req.body

    console.log('send', req.body)

    if (!email || !sum) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    if (!token) {
      return res.status(400).json({
        message: 'Помилка',
      })
    }

    const user = User.getUserByToken(token)

    if (!user) {
      return res.status(400).json({
        message: 'Користувача не існує',
      })
    }

    const balance = Balance.getBalance(token)

    if (!balance) {
      return res.status(400).json({
        message: 'Не вдалося завантажити баланс',
      })
    }

    if (sum > balance.balance) {
      return res.status(400).json({
        message: 'Не достатньо грошей',
      })
    } else {
      const receiver = User.getUserByEmail(email)
      if (!receiver) {
        return res.status(400).json({
          message: 'Не вдається знайти отримувача',
        })
      }

      if (receiver.token === token) {
        return res.status(400).json({
          message: 'Ви не можете надіслати гроші собі',
        })
      }
      const receiverBalance = Balance.getBalance(
        receiver.token,
      )
      if (!receiverBalance) {
        return res.status(400).json({
          message: 'Помилка',
        })
      }
      balance.reduce(sum)
      receiverBalance.add(sum)

      user.addTransaction(sum, 'send', email)

      user.addNotification(
        NOTIFICATION_TYPE.ANNOUNCE,
        NOTIFICATION_TEXT.SEND,
      )

      receiver.addTransaction(sum, 'receive', email)

      receiver.addNotification(
        NOTIFICATION_TYPE.ANNOUNCE,
        NOTIFICATION_TEXT.RECEIVE,
      )

      return res.status(200).json({
        result: true,
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
