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
//Upload files
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var originalname, path

//Netbeast API
var netbeast = require('netbeast')

/*var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); */


// Netbeast apps need to accept the port to be launched by parameters
var argv = require('minimist')(process.argv.slice(2))

app.use(express.static('public'))

var server = app.listen(argv.port || 31416, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})

app.post('/upload', upload.single('file'), function (req,res) {

	if(!req.file) res.send('Not track selected')
	originalname = req.file.originalname
	path = req.file.path

	if(req.file.mimetype !== 'audio/mp3') return res.status(406).send('File format not acceptable')
})

app.post('/play', function (req,res) {
	console.log('playing')
	console.log(originalname)
	/*
	beast.find().then(function () {
       netbeast('sound').set({volume: 30, status: 'play', track: path})
		.then(function (data) {
           res.send("Playing" + originalname)
		})
		.catch(function (error) {})
	})*/
})
