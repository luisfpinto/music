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
  
	if(req.file.mimetype !== 'audio/mp3' && req.file.mimetype !== 'audio/mp4' && req.file.mimetype != 'audio/mpeg') {
    netbeast.error('File Format not acceptable')    
    res.sendStatus(405)
  } 
  netbeast.find().then(function () {
       netbeast('music').set({track: 'http://' + process.env.NETBEAST + '/i/music/uploads/' + originalname, volume: 20})
    .then(function (data) {
           netbeast.info('Playing: ' + originalname)
           res.sendStatus(200)
    })
    .catch(function (error) {})
  })
})

app.post('/play', function (req,res) {

  var volume = req.body.volume

	netbeast.find().then(function () {
       netbeast('music').set({status: 'play', volume: volume})
		.then(function (data) {
           netbeast.info('Playing: ' + originalname)
           res.sendStatus(200)
		})
		.catch(function (error) {})
	})
})

app.post('/pause', function (req,res) {

  var volume = req.body.volume

  netbeast.find().then(function () {
       netbeast('music').set({status: 'pause'})
    .then(function (data) {
           netbeast.info('Song Paused')
           res.sendStatus(200)
    })
    .catch(function (error) {})
  })
  res.sendStatus(200)
})

app.post('/volume', function (req,res) {

  var volume = req.body.volume

  netbeast.find().then(function () {
       netbeast('music').set({volume: volume})
    .then(function (data) {
           res.sendStatus(200)
    })
    .catch(function (error) {
      res.status(500).json(error)
    })
  })
})
