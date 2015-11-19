var http = require('http');
var fs = require('fs');
var cheerio = require("cheerio");
var request = require("request");
var path = require('path');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var run = async (function (){
  request({
    uri: "http://hymns.countedfaithful.org/numberListing.php",
  }, function(error, response, body) {
    var $ = cheerio.load(body);
    $('a').each(function(){
      var link = $(this);
      var href = link.attr('href');
      if(href.indexOf('.pdf')!==(-1)){
        var result = await processPdf(href);
      }
    });
  });
});

var processPdf = async (function (uri){

  var file = fs.createWriteStream('pdfs/'+path.basename(uri));
  var hymnObj = {};
  var request = await http.get(uri, function(response) {
    var r = response.pipe(file);
    
  });
});

var go = async (function() {
    var resultA = await (firstAsyncCall());
    var resultB = await (secondAsyncCallUsing(resultA));
    var resultC = await (thirdAsyncCallUsing(resultB));
    return doSomethingWith(resultC);
});
