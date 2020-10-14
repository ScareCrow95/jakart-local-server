let uiSocket
const { uiOutgoingEvents, uiIncomingEvents } = require('./connections.js')
const destinations = require('./destinations')
let timeoutGPS
var position = [38.433859, -78.862175]

module.exports = (io) => {
  uiOutgoingEvents.map((x) => {
    eventManager.on(x, (data) => {
      io.of('/ui').emit(x, data)
    })
  })

  eventManager.on('gps', (data) => {
    io.of('/ui').emit('gps', data)
  })

  // eventManager.on('passenger-video', (data) => {
  //   io.of('/ui').emit('passenger-video', data.toString('utf8'))
  // })

  io.of('/ui').on('connection', (socket) => {
    socket.emit('ui-init', CARTSTATE())
    socket.emit('get-destinations', destinations)
    uiSocket = socket
    socket.on('pullover', (x) => console.log('pullover: ' + x))
    uiIncomingEvents.map((x) => {
      socket.on(x, (data) => eventManager.emit(x, data))
    })
  })
}
