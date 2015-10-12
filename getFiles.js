var http = require('http');
var fs = require('fs');
var pdfText = require('pdf-text');
var cheerio = require("cheerio");
var request = require("request");
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var path = require('path');

var urlsArray = [];

request({
  uri: "http://hymns.countedfaithful.org/numberListing.php",
}, function(error, response, body) {
  var $ = cheerio.load(body);
  $('a').each(function(){
    var link = $(this);
    var href = link.attr('href');
    if(href.indexOf('.pdf')!==(-1)){
        urlsArray.push(href);
    }
  });
  buildDB();
});
