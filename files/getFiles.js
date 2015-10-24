var http = require('http');
var fs = require('fs');
var cheerio = require("cheerio");
var request = require("request");
var path = require('path');


request({
  uri: "http://hymns.countedfaithful.org/numberListing.php",
}, function(error, response, body) {
  var $ = cheerio.load(body);
  $('a').each(function(){
    var link = $(this);
    var href = link.attr('href');
    if(href.indexOf('.pdf')!==(-1)){
      processPdf(href);
    }
  });
});

function processPdf(uri){

  var file = fs.createWriteStream('pdfs/'+path.basename(uri));
  var hymnObj = {};
  var request = http.get(uri, function(response) {
    var r = response.pipe(file);
    
  });
  fs.stream.end();
}
