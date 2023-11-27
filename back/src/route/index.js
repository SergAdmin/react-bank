// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()


const { User } = require('../class/user')
const { Balance } = require('../class/balance')

User.addUser('ivan@gmail.com', 'Password.001')
User.addUser('stepan@gmail.com', 'Password.002')
User.addUser('petro@gmail.com', 'Password.003')

Object.entries(User.getList()).forEach(([key, value]) => {
  const user = User.getUserByEmail(String(value.email))

  user.validateUser()
  Balance.create(user.token)
  let bal = Balance.getBalance(user.token)

  if (String(value.email) === 'ivan@gmail.com') {
    bal.add(5000.0)
  } else if (String(value.email) === 'stepan@gmail.com') {
    bal.add(4000.0)
  } else if (String(value.email) === 'petro@gmail.com') {
    bal.add(3000.0)
  }
})

Object.entries(User.getList()).forEach(([key, value]) => {
  const user = User.getUserByEmail(String(value.email))

  console.log(value)
})
// Підключіть файли роутів
// const test = require('./test')


const signup = require('./signup')

const signin = require('./signin')

const settigns = require('./settings')

const send = require('./send')

const balance = require('./balance')

const receive = require('./receive')

const notification = require('./notification')

const transaction = require('./transaction')


// Підключіть інші файли роутів, якщо є

router.use('/', signup)

router.use('/', send)

router.use('/', signin)

router.use('/', settigns)

router.use('/', balance)

router.use('/', receive)

router.use('/', notification)

router.use('/', transaction)

// Об'єднайте файли роутів за потреби
// router.use('/', test)
// Використовуйте інші файли роутів, якщо є

router.get('/', (req, res) => {
  res.status(200).json('Server started...')
})

// Експортуємо глобальний роутер
module.exports = router
