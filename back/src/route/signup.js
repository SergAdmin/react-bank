const express = require('express')

const router = express.Router()

const { User } = require('../class/user.js')

const { Code } = require('../class/code.js')

const { Balance } = require('../class/balance.js')

///////////////////////////////////////////

router.post('/signup', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Будьте уважні, не всі поля заповнені',
      })
    }

    if (User.getUserByEmail(email)) {
      return res.status(400).json({
        message: 'Користувач з таким email вже зареєстрований',
      })
    } else {
      User.addUser(email, password)

      console.log(User.getUserByEmail(email).token)

      return res.status(200).json({
        user: User.getUserByEmail(email),
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err.message,
    })
  }
})

////////////////////////////////////

router.post('/signup-confirm', (req, res) => {
  try {

    //Намагаємось отримати пошту 

    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message:
          "Сталася помилка під час отримання електронної пошти",
      })
    }

    //Генеримо код для підтвердження та виводимо в консоль

    Code.createCode(email)

    const code = Code.getCode(email)

    console.log(code.code)

    if (code) {
      return res.status(200).json({
        code: code.code,
      })
    } else {
      return res.status(400).json({
        message:
          "Сталася помилка під час отримання електронної пошти",
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: err.message,
    })
  }
})

///////////////////////////////////

router.post('/signup-confirm-code', (req, res) => {
  try {

    //Намагаємось отримати та перевірити вхідні дані

    const { isConfirmed, email, token } = req.body

    console.log('signup-confirm-code', req.body)

    if (!isConfirmed) {
      return res.status(400).json({
        message: 'Помилка завантаження',
      })
    } else {
      if (!token) {
        return res.status(400).json({
          message: 'Помилка отримання токена',
        })
      }
      
      const user = User.getUserByToken(token)

      if (!user) {
        return res.status(400).json({
          message: "Користувач з таким email не зареєстрований",
        })
      }

      user.validateUser()

      if (!user.isConfirmed) {
        return res.status(400).json({
          message: 'Помилка підтвердження',
        })
      } else {
        Balance.create(token)

        Code.deleteCode(email)

        return res.status(200).json({
          isConfirmed: true,
        })
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    })
  }
})

module.exports = router
