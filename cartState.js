global.CARTID = require('./connections').cartID
const fs = require('fs')
const destinations = require('./destinations')

let cartState
global.CARTSTATE = () => cartState

const io = require('socket.io-client')
const socket = io('http://35.238.125.238:8020/cart')
// const socket = io('http://localhost:8020/cart')

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
    cartState.userId = data.id
    cartState.latitude = data.latitude
    cartState.longitude = data.longitude
    cartState.state = 'summon-start'
    writeState()
    eventManager.emit('drive-to', data)
    eventManager.emit('summon', data)
    eventManager.emit('ui-init', cartState)
  })

  eventManager.on('destination', (name) => {
    if (destinations[name]) {
      cartState.destination = name
      setTimeout(() => {
        cartState.state = 'transit-start'
        eventManager.emit('drive-to', JSON.stringify(destinations[name]))
        eventManager.emit('ui-init', cartState)
        socket.emit('transit-start', cartState)
      }, 4)
      // might need to remove json.stringify
      writeState()
    }
  })

  eventManager.on('arrived', () => {
    if (cartState.destination === '') {
      cartState.state = 'summon-finish'
    } else {
      cartState.state = 'transit-end'
      setTimeout(() => {
        cartState.state = 'idle'
        cartState.pullover = false
        cartState.userId = ''
        cartState.destination = ''
        writeState()
        eventManager.emit('ui-init', cartState)
        socket.emit('passenger-exit')
      }, 8000)
    }
    writeState()
    eventManager.emit('ui-init', cartState)
    socket.emit(cartState.state)
  })

  cartState = JSON.parse(fs.readFileSync('../cart.json', 'utf-8'))

  if (
    cartState.state === 'summon-start' ||
    cartState.state === 'transit-start'
  ) {
    eventManager.emit('drive-to', cartState)
  }

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
