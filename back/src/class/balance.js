//Отримуємо баланс по токену
//додаємо запис
//суму збільшуємо
//суму зменшуємо
//

class Balance {
  static #list = []

  constructor(token) {
    this.token = token
    this.balance = 0
  }

  static create = (token) => {
    const balance = new Balance(token)
    this.#list.push(balance)
  }

  add = (sum) => {
    this.balance = Number(this.balance) + Number(sum)
  }

  reduce = (sum) => {
    this.balance = Number(this.balance) - Number(sum)
  }

  static getBalance = (token) => {
    return (
      this.#list.find((itme) => itme.token === token) ||
      false
    )
  }
}

module.exports = {
  Balance,
}
