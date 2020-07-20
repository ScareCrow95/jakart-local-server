global.CARTID = require('./connections').cartID
const fs = require('fs')

let cartState
global.CARTSTATE = () => cartState

const io = require('socket.io-client')
// const socket = io('http://35.238.125.238:8020')
const socket = io('http://localhost:8020/cart')

module.exports.init = () => {
  socket.on('connect', () => {
    socket.emit('cart-connect', cartState)
  })

  socket.on('summon-cancel', () => {
    eventManager.emit('summon-cancel')
    cartState.state = 'idle'
    cartState.userId = ''
    ;(cartState.destination = ''), writeState()
    eventManager.emit('ui-init', cartState)
  })

  socket.on('reset-client', () => {
    eventManager.emit('reset-client')
    cartState.state = 'idle'
    cartState.destination = ''
    cartState.userId = ''
    writeState()
  })

  socket.on('summon', (data) => {
    console.log(data)
    cartState.userId = data.id
    cartState.latitude = data.latitude
    cartState.longitude = data.longitude
    cartState.state = 'summon-start'
    writeState()
    eventManager.emit('summon', data)
    eventManager.emit('ui-init', cartState)
  })

  eventManager.on('destination', (name) => {
    cartState.destination = name
    writeState()
  })

  eventManager.on('arrived', () => {
    if (cartState.destination === '') {
      cartState.state = 'summon-finish'
    } else {
      cartState.state = 'transit-end'
    }
    writeState()
    eventManager.emit('ui-init', cartState)
    socket.emit(cartState.state)
  })

  eventManager.on('passenger-exit', () => {
    cartState.state = 'idle'
    cartState.userId = ''
    cartState.destination = ''
    writeState()
    eventManager.emit('ui-init', cartState)
    socket.emit('passenger-exit')
  })

  cartState = JSON.parse(fs.readFileSync('../cart.json', 'utf-8'))

  return cartState
}

module.exports.rosConnect = () => {
  cartState.active = true
  writeState()
  socket.emit('cart-active', true)
  eventManager.emit('ui-init', cartState)
}

module.exports.rosDisconnect = () => {
  cartState.active = false
  writeState()
  socket.emit('cart-active', false)
  eventManager.emit('ui-init', cartState)
}

function writeState() {
  fs.writeFileSync('../cart.json', JSON.stringify(cartState))
}
