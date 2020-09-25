const ROSLIB = require('roslib')
const cartState = require('./cartState')

const ros = new ROSLIB.Ros({
  url: 'ws://127.0.0.1:9090',
})

module.exports = () => {
  eventManager.on('drive-to', (data) => {
    SendDriveRequest(data.latitude, data.longitude)
  })
}

ros.on('connection', function () {
  console.log('Connected to websocket server.')
  subscribeToTopics()
  cartState.rosConnect()
})

ros.on('error', function (error) {
  console.error(
    'Error connecting to websocket server, Check that ros bridge is running on port 9090'
  )
  cartState.rosDisconnect()
})

ros.on('close', function () {
  console.log('Connection to websocket server closed.')
  cartState.rosDisconnect()
})

function subscribeToTopics() {
  new ROSLIB.Topic({
    ros: ros,
    name: '/arrived...',
    messageType: 'std_msgs/String',
  }).subscribe((x) => {
    eventManager.emit('arrived')
  })

  new ROSLIB.Topic({
    ros: ros,
    name: '/gps....',
    messageType: 'std_msgs/String',
  }).subscribe((x) => {
    const data = { latitude: x.data.latitude, longitude: x.data.longitude }
    eventManager.emit('gps', data)
  })
}

function SendDriveRequest(latitude, longitude) {
  const topic = new ROSLIB.Topic({
    ros: ros,
    name: '/gps_request',
    messageType: 'navigation_msgs/LatLongPoint',
  })
  const msg = new ROSLIB.Message({
    latitude: latitude,
    longitude: longitude,
    elevation: 0,
  })

  console.log('Publishing drive to request')
  topic.publish(msg)
}
