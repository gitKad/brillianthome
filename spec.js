'use strict'

const chai = require('chai')
const sinon = require('sinon')
const Zombie = require('zombie')
const chaiAsPromised = require('chai-as-promised')

const expect = chai.expect
chai.use(chaiAsPromised);

var PhilipsHueBridge = require('./philipsHueBridge.js')

describe.skip('My Philips Hue Bridge', function() {

  var phb = new PhilipsHueBridge()

  describe('externaly', function() {

  })

  describe('internally', function() {

    before(function(done) {
      var requestStub = sinon.stub(request,'get')
      requestStub
        .yields(null, {statusCode: 404},'')
      requestStub
        .withArgs('http://192.168.137.123/api')
        .yields(null, {statusCode: 200}, JSON.stringify([{ "error": { "type": 1, "address": "/", "description": "unauthorized" }}]))
      done()
    })

    after(function(done) {
      request.get.restore()
      done()
    })

    it('can connect given the right address', function() {
      return phb.connect('192.168.137.123')
      .then((result) => {
        expect(result).to.be.an('array').with.a.lengthOf(2)
        expect(result[0]).to.have.property('statusCode',200)
        expect(JSON.parse(result[1])[0]).to.be.ok.and.have.deep.property('error.description')
      })
    })

    it('can\'t connect given the wrong address', function() {
      return phb.connect('127.0.0.1')
      .catch((result) => {
        expect(result).to.be.an('error')
      })
    })

    it('can list detected lights', function() {
      expect(phb.getLights()).to.be.an('array').with.a.lengthOf(2)
    })
  })
})

describe('My webpage', function() {

  const Server = require('./app.js')
  var server

  beforeEach(function(done) {
      server = new Server()
      server.start(done)
  })

  afterEach(function(done) {
      server.stop(done)
  })

  it('works (external resources are reachable)', function(done) {
      var browser = new Zombie()

      browser.visit('http://localhost:1338')
      .then(function() {
          browser.assert.success()
      })
      .then(done)
  });

  it('initializes as expected', function(done) {
      var browser = new Zombie()

      browser.visit('http://localhost:1338/rules')
      .then(function() {
          let jsonBody = JSON.parse(browser.query('body').textContent)
          expect(jsonBody).to.be.lengthOf(5)
      })
      .then(done)
  })
})
