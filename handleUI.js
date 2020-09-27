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
    console.log(data);
    io.of('/ui').emit('gps', data)
  })

  // var numDeltas = 100
  // var delay = 10 //milliseconds
  // var i = 0
  // var deltaLat
  // var deltaLng
  // function transition(result) {
  //   i = 0
  //   deltaLat = (result.latitude - position[0]) / numDeltas
  //   deltaLng = (result.longitude - position[1]) / numDeltas
  //   moveMarker()
  // }

  // function moveMarker() {
  //   position[0] += deltaLat
  //   position[1] += deltaLng
  //   io.of('/ui').emit('gps', { latitude: position[0], longitude: position[1] })
  //   if (i != numDeltas) {
  //     i++
  //     timeoutGPS = setTimeout(moveMarker, delay)
  //   }
  // }

  // eventManager.on('passenger-video', (data) => {
  //   io.of('/ui').emit('passenger-video', data.toString('utf8'))
  // })

  io.of('/ui').on('connection', (socket) => {
    socket.emit('ui-init', CARTSTATE())
    socket.emit('get-destinations', destinations)
    uiSocket = socket

    uiIncomingEvents.map((x) => {
      socket.on(x, (data) => eventManager.emit(x, data))
    })
  })
}
