const express = require('express')
const router = express.Router()

const { Balance } = require('../class/balance')

const { User } = require('../class/user')

router.post('/balance', (req, res) => {
  try {
    const { token } = req.body

    //Отримуємл токен

    if (!token) {
      return res.status(400).json({
        mesasge: 'Не вдалося отримати токен',
      })
    }

    //Пробуємо отримати користувача по токену

    const user = User.getUserByToken(token)

    if (!user) {
      return req.status(400).json({
        message: 'Не вдалося отримати користувача',
      })
    }

    //Пробуємо отримати транзакції користувача

    const transactions = user.transactions

    if (!transactions) {
      return req.status(400).json({
        message: 'Не вдалося завантажити транзакції',
      })
    }

    //Пробуємо отримати залишки по токену

    const balance = Balance.getBalance(token)

    if (!balance) {
      return req.status(400).json({
        message: 'Не вдалося завантажити баланс',
      })
    }

    return res.status(200).json({
      balance: balance.balance,
      transactionsList: transactions,
    })
  } catch (err) {
    return res.status(400).json({
      mesasge: 'Помилка', // все пішло не за планом
    })
  }
})

module.exports = router
