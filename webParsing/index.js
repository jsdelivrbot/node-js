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
 

var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm';

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    for (var i = 0; i < $('a').length; i++) { 
      if ($('a').eq(i).hasClass('lien-jv topic-title'))
        console.log($('a').eq(i).text());
    }
  }
});
 