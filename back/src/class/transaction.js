//розшифрування транзакції

const User = require('./user')

class Transaction {
  static transactions = []

  constructor(sum, type, resEmail) {
    this.sum = sum
    this.type = type
    this.resEmail = resEmail
    this.date = new Date()
    this.id = Transaction.transactions.length + 1

    Transaction.transactions.push(this)
  }

  getUserTransactionById(user, id) {
    return user.transactions.find(
      (id) => user.transaction.id === id,
    )
  }
}

module.exports = { Transaction }
