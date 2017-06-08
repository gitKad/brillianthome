const chai = require('chai')
const sinon = require('sinon')
const Zombie = require('zombie')
const request = require('request')
const chaiAsPromised = require('chai-as-promised')
const PhilipsHueBridge = require('../src/philipsHueBridge.js')

const expect = chai.expect
chai.use(chaiAsPromised)

const mochaUser = 'jIov7xiH0qhB2kt9RypRkUdWI7Pei1WpQV74bQ7R'
const hubIP = '192.168.137.106'

describe('My Philips Hue Bridge', function() {

  var phb = new PhilipsHueBridge()

  describe('externaly', function() {
    let requestStub
    before(function() {
      requestStub = sinon.spy(request,'get')
    })

    after(function() {
      request.get.restore()
    })

    beforeEach(function() {
      return phb.connect(hubIP)
      .then(()=>{
        return phb.login(mochaUser)
      })
    })

    it('can create a rule', async function() {
      let result = await phb.createRule()
      expect(result).to.be.a('number')

      let rules = await phb.getRules()
      expect(rules).to.have.property(`${result}`)
    })

    it('can list rules', async function() {
      let rules = await phb.getRules()
      expect(rules).to.have.property("1")        
    })
  })

  describe('internally', function() {
    let requestStub
    before(function(done) {
      requestStub = sinon.stub(request,'get')
      requestStub
        .yields(null, {statusCode: 404},'')
      requestStub
        .withArgs(`http://${hubIP}/api`)
        .yieldsAsync(null, {statusCode: 200}, JSON.stringify([{ "error": { "type": 1, "address": "/", "description": "unauthorized" }}]))
      done()
    })

    after(function(done) {
      request.get.restore()
      done()
    })

    it('can connect given the right address', function() {
      return phb.connect(hubIP)
      .then((result) => {
        expect(phb.address).to.be.eql(hubIP)
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
  })
})

describe('My webpage', function() {

  const Server = require('../src/app.js')
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
          expect(browser.query('body').textContent).to.be.lengthOf(35)
      })
      .then(done)
  })
})
