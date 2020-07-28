let uiSocket
const { uiOutgoingEvents, uiIncomingEvents } = require('./connections.js')
const destinations = require('./destinations')

const destinationsArr = Object.keys(destinations).map((x) => {
  return { name: x }
})

module.exports = (io) => {
  uiOutgoingEvents.map((x) => {
    eventManager.on(x, (data) => {
      io.of('/ui').emit(x, data)
    })
  })

  io.of('/ui').on('connection', (socket) => {
    socket.emit('ui-init', CARTSTATE())
    socket.emit('get-destinations', destinationsArr)
    uiSocket = socket

    uiIncomingEvents.map((x) => {
      socket.on(x, (data) => eventManager.emit(x, data))
    })
  })
}
