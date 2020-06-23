const protocol = require('./auditor-protocol');

const dgram = require('dgram');
const moment = require('moment');

// array for active musician
var activePlayer = []

const instruments = new Map();
instruments.set("ti-ta-ti", "piano");
instruments.set( "pouet", "trumpet");
instruments.set("trulu", "flute");
instruments.set("gzi-gzi", "violin");
instruments.set("boum-boum", "drum");

/* 
 * Let's create a datagram socket. We will use it to listen for datagrams published in the
 * multicast group by musician and containing uuid and sound
 */
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

/* 
 * This call back is invoked when a new datagram has arrived.
 */
s.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);
	playerHandler(msg);
});

// sert a update le timestamp directement "T'as vu l'optimisation ou bien ?????"
function updateTimeStamp(x) {
    x.timestamp = moment()
    return true;
}
// sert a handle un payload UDP pour savoir qu'en faire :) update le tableau de musician actif
function playerHandler(payload) {
    var musician = JSON.parse(payload)
    console.log("handling : "+ payload);
    
    var foundMusician = activePlayer.find(function (x) {
        // si on a trouvé on update le timestamp dans la deuxieme condition
        return x.uuid == musician.uuid && updateTimeStamp(x);
    });
    
     if(typeof foundMusician === 'undefined') {
        // il est pas encore dans le tableau
       musician.timestamp = moment();
       activePlayer.push(musician);
     }     
}

