const express = require('express')
const logger = require('morgan')
const pug = require('pug')
const compiledFunction = pug.compileFile(__dirname + '/source/template.pug');
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')
const IP = require('ip')

app.use(logger('dev'))
app.use(express.static(__dirname + '/'))
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


app.get('/', (req, res) => {
  try {
    var html = compiledFunction({name:"Laptop"});
    res.send(html)
  } catch (e) {
    next(e)
  }
});

//when device logged in to server address, this function serves pug template on device
app.get('/device', (req, res) => {
  try {
    var html = compiledFunction({name:"Device"})
    res.send(html)
  } catch (e) {
    next(e)
  }
});

//when device page loaded, sends deviceId to server and is saved here
app.post('/deviceRegistration', (req, res) =>{
	var deviceId = req.body["deviceId"]
	var content = "https://pathways-imgserver.herokuapp.com/source/ddds.jpg"
	global.deviceList.push({"id":deviceId,"content":content})
	res.sendStatus(200)
});

//pug template then runs this code
app.post('/poll', (req, res) => {
	var contentFolder = global.content
	//read contents of folder selected by controller
	// fs.readdirSync(contentFolder).forEach(content => {
	//   console.log(content)
	// })

	var device = null
	var requestingDeviceId = req.body["deviceId"]

	global.deviceList.forEach(function(element, index, theArray) {
		// console.log(element)
		if(element['id'].localeCompare(requestingDeviceId)==0) {
			res.send(element['content'])
			return
		}
	})

	// console.log(req.body)
	console.log('devices', global.deviceList);
	//populate deviceList array
	//check if device is on list
	//if not on list add it
	//send content from control

	// res.sendStatus(400)

});

let changes = 0; //counter for how many changes there are

app.post('/control', (req, res) => {
	//read message from controller
	//for each device, pick a random image from contentFolder selected
	let deviceIdx = changes%(global.deviceList.length);
	global.deviceList[deviceIdx]['content'] = req.body.url;
	changes++;
	res.sendStatus(200)
});


app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log('Listening on http://localhost:' + (process.env.PORT || 5000))
  global.deviceList=[];
});
