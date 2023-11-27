//генеруємо код для підтвердження
//валідуємо код
//видаляємо код

class Code {
  static #list = []

  constructor(email) {
    this.code = Code.generateCode()
    this.email = email
  }

  static validate = (email, code) => {
    const newCode = Code.getCode(email)
    if (!newCode) {
      return false
    }
    if (newCode.code === code) {
      return true
    } else {
      return false
    }
  }

  static getList = () => {
    return this.#list
  }

  static createCode = (email) => {
    const code = new Code(email)
    setTimeout(() => {
      Code.deleteCode(email)
    }, 1000 * 60 * 60 * 24)
    this.#list.push(code)
  }

  static generateCode = () => {
    return Math.floor(Math.random() * 899999 + 100000)
  }

  static getCode = (email) => {
    return (
      this.#list.find((item) => item.email === email) ||
      false
    )
  }

  static deleteCode = (email) => {
    this.#list = this.#list.filter(
      (item) => item.email !== email,
    )
  }
}

module.exports = {
  Code,
}
