const express = require('express')

const router = express.Router()

const { User } = require('../class/user.js')

router.get('/transaction', (req, res) => {
  try {
    const { token, id } = req.query

    console.log('transaction', req.query)

    if (!token || !id) {
      return res.status(400).json({
        message: 'Помилка при завантаженні операції',
      })
    }

    const user = User.getUserByToken(token)

    if (!user) {
      return res.status(400).json({
        message: 'Помилка при завантаженні користувача',
      })
    }

    const transaction = user.getTransactionById(id)

    if (!transaction) {
      return res.status(400).json({
        message: 'Не вдалося отримати транзакцію',
      })
    }

    return res.status(200).json({
      transaction: transaction,
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
