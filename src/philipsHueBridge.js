const request = require('request-promise')

class philipsHueBridge {
  constructor () {
    this.address = ''
    this.user = ''
  }

  connect (address) {
    let self = this
    return new Promise(function (resolve, reject) {
      var url = 'http://' + address + '/api'
      
      request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          self.address = address
          resolve([response, body])
        } else {
          reject(Error(response.statusCode))
        }
      })
    })
  }

  login (username) {
    this.user = username
    return Promise.resolve()
  }

  async getRules() {
    var options = {
      url: 'http://' + this.address + '/api/' + this.user + '/rules'
    }

    let result = await request.get(options)
    return JSON.parse(result)
  }

  async createRule() {
     var options = {
      url: 'http://' + this.address + '/api/' + this.user + '/rules',
      method: 'POST',
      body: {
        name: "Test Rule",
        conditions: [
          {
            adress: "/testAdress"
          }
        ]
      }
    }

    //let result = await request.get(options)
    result
    return JSON.parse(result)
  }
}

module.exports = philipsHueBridge
