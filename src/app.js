const express = require('express')
const HueBridge = require('./philipsHueBridge.js')

class Application {
  constructor() {
    this.app = ''
    this.server = ''
  }

  start(cb) {
    this.app = new express()

    this.app.get('/', function (req, res) {
      res.send('Hello World!')
    })

    this.app.get('/rules', function (req, res) {
      res.send('{"1": {"name": "Wall Switch Rule"}}')
    })

    this.server = this.app.listen(1338, cb)
  }

  stop(cb) {
    this.server.close(cb)
  }
}

module.exports = Application