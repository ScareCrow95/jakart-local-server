const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const cartState = require('./cartState')
const handleUI = require('./handleUI')
const handleROS = require('./handleROS')
const handleROSLib = require('./handleROSLib')

const events = require('events').EventEmitter
global.eventManager = new events()
;(async function init() {
  cartState.init()
  handleUI(io)
  handleROSLib()
  //handleROS(io) // socket io
  server.listen(8029, () => {
    console.log('local-socket-server started at 8021')
  })
})()
