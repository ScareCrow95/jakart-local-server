const cartState = require('./cartState')

module.exports = (io) => {
  io.of('/pose').on('connection', async (socket) => {
    socket.on('pose', (x) => {
      //   console.log(x)
      eventManager.emit('pose', x)
    })
  })
}
