'use strict'

var request = require('request')

var philipsHueBridge = function() {
  this.address = ''
  this.user = ''
}

philipsHueBridge.prototype.connect = function(address) {
  return new Promise(function(resolve, reject) {
    var url = 'http://'+address+'/api'
    request.get(url, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        this.address = address
        resolve([response, body])
      } else {
        reject(Error(response.statusCode))
      }
    })
  })
}

philipsHueBridge.prototype.login = function (username) {
  return new Promise(function(resolve, reject) {
      var options = {
        url:'http://'+this.address+'/api',
        body: {"devicetype":"brillianthome#brain"}
      }

      request.post(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          this.address = address
          resolve([response, body])
        } else {
          reject(Error(response.statusCode))
        }
      })
    })
    .then((res, bod) => {
      console.log('hey the user is :', bod)
      this.user = bod
    })
}

philipsHueBridge.prototype.getRules = function () {
  return new Promise(function(resolve, reject) {
      var options = {
        url:'http://'+this.address+'/api/'+this.user+'/rules'
      }

      request.get(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          resolve(JSON.parse(body))
        } else {
          reject(Error(response.statusCode))
        }
      })
    })
}

module.exports = philipsHueBridge
