//робота з користувачем
//додавання користувача
//додавання транзакцій
//отримання транзакції по ID
//додавання типу операції
//видалення типу операції
//валідація користувача
//створення токену
//отримання користувача по токену
//отримання по email

///////////////////////
const CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*.,_'

const { Transaction } = require('./transaction')

const { Notification } = require('./notification')

class User {
  static #list = []

  constructor(email, password) {
    this.id = User.#list.length + 1
    this.email = email
    this.password = password
    this.isConfirmed = false
    this.isLogged = false
    this.token = User.tokenGeneration()
    this.transactions = []
    this.notifications = []
  }

  static addUser = (email, password) => {
    const user = new User(email, password)
    this.#list.push(user)
  }

  addTransaction = (sum, type, resEmail) => {
    const transaction = new Transaction(sum, type, resEmail)
    this.transactions.push(transaction)
  }

  getTransactionById = (id) => {
    return (
      this.transactions.find(
        (item) => item.id === Number(id),
      ) || false
    )
  }

  addNotification = (type, text) => {
    const notification = new Notification(type, text)
    setTimeout(() => {
      deleteNotification(notification.id)
    }, 1000 * 60 * 60 * 24)
    this.notifications.push(notification)
  }

  deleteNotification = (id) => {
    this.notifications = this.notifications.filter(
      (item) => item.id !== id,
    )
  }

  static getList = () => {
    return this.#list
  }

  validateUser = () => {
    this.isConfirmed = true
  }

  static tokenGeneration = () => {
    return (
      String(new Date().getTime()) +
      CHARACTERS[
        Math.floor(Math.random() * CHARACTERS.length)
      ] +
      CHARACTERS[
        Math.floor(Math.random() * CHARACTERS.length)
      ] +
      CHARACTERS[
        Math.floor(Math.random() * CHARACTERS.length)
      ]
    )
  }

  static getUserByToken = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      false
    )
  }

  static getUserByEmail = (email) => {
    return (
      this.#list.find((item) => item.email === email) ||
      false
    )
  }
}

module.exports = {
  User,
}
