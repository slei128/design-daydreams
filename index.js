const express = require('express')
const logger = require('morgan')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const IP = require('ip')
const http = require('http').Server(app);
const io = require('socket.io')(http);

var rooms = {};

app.use(logger('dev'));
app.use(express.static(__dirname + '/static'));
// Add headers, i.e. what the server can accept
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// cycles through the list of devices after it receives an image url
// sends it to the next available device (last changed)
app.post('/control', (req, res) => {
  // we need to send a displayImage message to this device socket
  let room = rooms["abc"];
  let nextClient = room.clients[ room.nextClientNr ];
  nextClient.currentContent = req.body.url;
  nextClient.socket.emit('displayImage', {'url': req.body.url});
  
  room.nextClientNr ++;
  if (room.nextClientNr >= room.clients.length) {
    room.nextClientNr = 0;
  }

	res.sendStatus(200)
});


http.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log('Listening on http://localhost:' + (process.env.PORT || 5000))
});

//runs when socket connection is established ie catches connected device
io.on('connection', (socket)=> {
  let roomid = socket.handshake.query.room;
  socket.join(roomid);

  if (!(roomid in rooms)) {
    // create new room
    rooms[roomid] = {
      clients: [],
      nextClientNr: 0
    }
    console.log('created room '+roomid);
  }
  let room = rooms[roomid];
  let client = {
    socket: socket,
    clientID: socket.id,
    currentContent: null
  }
  console.log('client '+client.clientID+' joined room id ' + roomid);

  room.clients.push(client);

  socket.on('disconnect', () => { // disconnect is a special keyword
    console.log("a client disconnected: "+client.clientID);
    room.clients = room.clients.filter(
      (el) => (el !== client)
    );
    if (room.nextClientNr >= room.clients.length) {
      room.nextClientNr = 0;
    }
  });
});
