const express = require('express')

const router = express.Router()

const { User } = require('../class/user.js')

const { Code } = require('../class/code.js')

const {
  NOTIFICATION_TEXT,
  NOTIFICATION_TYPE,
} = require('../const/notifications.js')

module.exports = {
  NOTIFICATION_TEXT,
  NOTIFICATION_TYPE,
}

///////////////////////////////

router.post('/signin', (req, res) => {
  console.log('Signin', req.body)

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    const user = User.getUserByEmail(email)

    console.log('getUserByEmail', user)

    if (!user) {
      return res.status(400).json({
        message:
          'Користувач з таким email ще не зареєстрований',
      })
    }

    console.log(user.password, ' ', password)

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Ви ввели не правильний пароль',
      })
    } else {
      if (user.password === password) {
        user.addNotification(
          NOTIFICATION_TYPE.WARNING,
          NOTIFICATION_TEXT.LOGIN,
        )
        return res.status(200).json({
          message: 'Ввійти в обліковий запис!',
          userData: user,
        })
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка під час реєстрації',
    })
  }
})

/////////////////////////////

router.post('/recovery', (req, res) => {
  try {
    const { email } = req.body

    console.log('recovery', req.body)

    if (!email) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    const user = User.getUserByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'Користувач з таким email ще не зареєстрований',
      })
    } else {
      Code.createCode(email)

      const code = Code.getCode(email)

      console.log(code)

      if (!code) {
        return res.status(400).json({
          message: 'Помилка відправки кода',
        })
      }

      return res.status(200).json({
        message: 'Успішо',
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка під час відновлення',
    })
  }
})

////////////////////////////////////

router.post('/recovery-confirm', (req, res) => {
  try {
    const { newPassword, code, email } = req.body

    console.log('recovery-confirm', req.body)

    if (!newPassword || !code) {
      return res.status(400).json({
        message: 'Заповніть всі поля',
      })
    }

    const user = User.getUserByEmail(email)

    const correctCode = Code.getCode(email)

    console.log('Correct code', correctCode)

    if (!correctCode) {
      return res.status(400).json({
        message: 'Не вдалося перевірити код',
      })
    } else {
      if (correctCode.code !== Number(code)) {
        return res.status(400).json({
          message: 'Ви ввели не правильний код',
        })
      } else {
        user.password = newPassword

        if (user.password !== newPassword) {
          return res.status(400).json({
            message: 'Не вдалося змінити пароль',
          })
        }

        user.addNotification(
          NOTIFICATION_TYPE.WARNING,
          NOTIFICATION_TEXT.RECOVERY,
        )

        return res.status(200).json({
          user: user,
        })
      }
    }
  } catch (err) {
    return res.status(400).json({
      message: 'Помилка під час відновлення',
    })
  }
})

module.exports = router
