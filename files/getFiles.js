var http = require('http');
var fs = require('fs');
var cheerio = require("cheerio");
var request = require("request");
var path = require('path');

var linkArray = []

var run = function (){
  request({
    uri: "http://hymns.countedfaithful.org/numberListing.php",
  }, function(error, response, body) {
    var $ = cheerio.load(body);
    $('a').each(function(){
      var link = $(this);
      var href = link.attr('href');
      if(href.indexOf('.pdf')!==(-1)){
        linkArray[] = href;
        var result = processPdf(href);
      }
    });
    processor(0);
  });
}

var processPdf = function (uri){

  var file = fs.createWriteStream('pdfs/'+path.basename(uri));
  var hymnObj = {};
  var request = http.get(linkArray[uri], function(response) {
    var r = response.pipe(file);
    processor(uri+=1);
  });
}

var processor = function(num){
  if(linkArray[num]){
    processPdf(num);
  }
  
}
