//визначення типу операції

class Notification {
  constructor(type, text) {
    this.type = this.isValidType(type) ? type : 'Unknown'
    this.text = text
    this.date = new Date()
    this.id = new Date().getTime()
  }

  isValidType(type) {
    return type === 'ANNOUNCE' || type === 'Warning'
  }
}

module.exports = {
  Notification,
}
