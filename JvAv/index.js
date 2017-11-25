'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
const request = require('request');
const cheerio = require('cheerio');
var url = 'http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm';

io.on('connection', (socket) => {
	console.log('Client connected');
	socket.on('disconnect', () => console.log('Client disconnected'));
	
		socket.emit("resetTopic");
		var url_temp = "https://avenoel.org/forum/"+String(1);
		url = url_temp;
	  	aveTopics(socket);
 			
 
		var url_temp = "http://www.jeuxvideo.com/forums/0-51-0-1-0-" + String((1*25)+1) +"-0-blabla-18-25-ans.htm"
		url = url_temp;
  		jvcTopics(socket);


});
 

function jvcTopics(socket) {
	request(url, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var topicCount = [];
			for (var i = 0; i < $('span').length; i++) {
				if ($('span').eq(i).hasClass('topic-count') && $('span').eq(i).text() != 'Nb') {
					topicCount.push(parseInt($('span').eq(i).text()));
				}
			}

			var topicName = [];
			var topicHref = [];
			var topicAuthor = [];
			for (var i = 0; i < $('a').length; i++) {
				if ($('a').eq(i).hasClass('lien-jv topic-title')) {
					topicName.push($('a').eq(i).text());
					topicHref.push($('a').eq(i).attr("href"));
				}

			}

			for (var i = 0; i < 25; i++) { 
				var data = {
					topicName : topicName[i],
					topicHref : topicHref[i],
					topicCount : topicCount[i],
					topicAuthor : topicAuthor[i],
					type : "jvc"
				} 
				socket.emit('topic', data);

				console.log(topicAuthor);
			}
 
	}
});	
}

function aveTopics(socket) {
	request(url, function (error, response, html) {
	  if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var topicCount = [];
			for (var i = 0; i < $('td').length; i++) {
				if ($('td').eq(i).hasClass('topics-amount hidden-xs hidden-sm')) {
				 topicCount.push(parseInt($('td').eq(i).text()));
				}
			}


			var topicName = [];
			var topicHref = [];
			for (var i = 0; i < $('td').length; i++) {
				if ($('td').eq(i).hasClass('topics-title')) {
					topicName.push($('td').eq(i).text());
					topicHref.push($('td').eq(i).children().attr("href"));
				}
			}

			for (var i = 0; i < 25; i++) { 
				console.log(topicHref[i]);
				var data = {
					topicName : topicName[i],
					topicHref : topicHref[i],
					topicCount : topicCount[i],
					topicAuthor : undefined,
					type : "ave"

				}
				socket.emit('topic', data);
			}
 
	}
});	



}



