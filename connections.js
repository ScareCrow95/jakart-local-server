module.exports = {
  // mongo: 'mongodb://localhost/jmu-local',
  cartId: 'jakart',
  uiOutgoingEvents: [
    'ui-init',
    'summon',
    'passenger-unsafe',
    'summon-cancel',
    'summon-finish',
    'path',
    // 'gps',
    // 'transit-start', // change
    // 'transit-end',
    'audio',
    'reset-client', //change
    'passenger-exit',
    // 'passenger-video',
  ],
  uiIncomingEvents: [
    'destination', //
    'transit-await',
    'pull-over',
    'resume-driving',
  ],
  rosIncomingEvents: [
    'gps',
    // 'passenger-unsafe',
    // 'transit-start',
    'arrived',
    // 'audio',
    'passenger-video',
    'cart-video',
    // 'passenger-exit',
  ],
  rosOutgoingEvents: [
    // 'transit-await',
    'pull-over',
    'resume-driving',
    'drive-to',
  ],
}

/* base state
const state = {
  _id: CARTID,
  summonlatitude: 0,
  summonlongitude: 0,
  destination: '',
  active: false,
  userId: '',
  state: 'idle',
}
*/
