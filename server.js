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

//Upload files
var multer  = require('multer')
var originalname, path

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });

//Netbeast API
var netbeast = require('netbeast')


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
	path = req.file.path

	if(req.file.mimetype !== 'audio/mp3') return res.status(406).send('File format not acceptable')

})

app.post('/play', function (req,res) {
	/*console.log('playing')
	console.log(originalname)
	console.log(path)*/
	
	//if(!req.file) res.send('Not track selected')
	netbeast.find().then(function () {
       netbeast('music').set({track: 'http://192.168.0.8:8000/i/music/uploads/test.mp3', volume: 10})
		.then(function (data) {
           res.send("Playing" + originalname)
		})
		.catch(function (error) {})
	})
})
