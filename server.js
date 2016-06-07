#!/usr/bin/env node

// server.js
// ==========

/*
* This is where all the magic happens.
* The Netbeast dashboard calls this script as is
* `node server.js --port <free port number>`
* after that everyline here will be executed.
*
* You can install extra modules thanks to the work
* of npm. Also you can create a shell script to
* install any missing system package.
*/

/* Requires node.js libraries */
var express = require('express')
var app = express()
var mime = require('mime')
var bodyParser = require('body-parser')

//Netbeast API
var netbeast = require('netbeast')

//Upload files
var multer  = require('multer')
var originalname

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });

//Parse Body
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}));

// Netbeast apps need to accept the port to be launched by parameters
var argv = require('minimist')(process.argv.slice(2))

app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

var server = app.listen(argv.port || 31416, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

app.post('/upload', upload.single('file'), function (req,res) {

	originalname = req.file.originalname
	if(req.file.mimetype !== 'audio/mp3' && req.file.mimetype !== 'audio/mp4' && req.file.mimetype != 'audio/mpeg') return res.status(406).send('File format not acceptable')
})

app.post('/play', function (req,res) {

  var volume = req.body.volume
  console.log('Play')

	netbeast.find().then(function () {
       netbeast('music').set({track: 'http://' + process.env.NETBEAST + '/i/music/uploads/' + originalname, volume: volume})
		.then(function (data) {
           res.send("Playing" + originalname)
		})
		.catch(function (error) {})
	})
})

app.post('/volume', function (req,res) {

  var volume = req.body.volume
  console.log('Volume')

  netbeast.find().then(function () {
       netbeast('music').set({volume: volume})
    .then(function (data) {
           res.send("Playing" + originalname)
    })
    .catch(function (error) {})
  })
})
