var protocol = require('./musician-protocol');
var dgram = require('dgram');
var s = dgram.createSocket('udp4');
var RFC4122 = require('rfc4122');
var rfc4122 = new RFC4122();


// map for instrument 
const instruments = new Map();
instruments.set("piano","ti-ta-ti");
instruments.set( "trumpet","pouet");
instruments.set("flute","trulu" );
instruments.set("violin","gzi-gzi");
instruments.set("drum","boum-boum" );


var instrument = process.argv[2];
var musician = Object();
musician.uuid = rfc4122.v1()
musician.sound = instruments.get(instrument)
message = JSON.stringify(musician)


// envoie toutes les 1 secondes sont datagram
setInterval(function () {
  s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
  function() {
    console.log("Sending payload: " + message + " via port " + s.address().port);
  })
}, protocol.INTERVAL);
