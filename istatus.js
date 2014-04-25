var http = require('http');
var fs = require('fs');
var express = require('express');
var url = require('url');
var util = require('util');
var bodyParser = require('body-parser');

var sessions = [];

var app = express();
app.use(bodyParser());

app.get("/", function(request, response) {
	var newArray = [];
	for(var i = 0; i < sessions.length; i++) {
		var session = sessions[i];
		var threshold = new Date();
		threshold.setMinutes(threshold.getMinutes() - 1);

		if (session.timestamp > threshold) {
			response.write(session.serial + " - " + session.app + "\r\n");
			newArray.push(session);
		}
	}

	sessions = newArray;

	response.end(JSON.stringify(sessions));
});

app.post('/sendData', function(req, res) {
	var session = req.body;
	session.timestamp = new Date();
	sessions.push(session);

	res.end();
});

app.listen(8082);