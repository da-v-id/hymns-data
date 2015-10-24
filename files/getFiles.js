var http = require('http');
var fs = require('fs');
var pdfText = require('pdf-text');
var cheerio = require("cheerio");
var request = require("request");
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
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
  buildDB();
});

function processPdf(uri){

var file = fs.createWriteStream(path.basename(uri));
var hymnObj = {};
var request = http.get(uri, function(response) {
    var r = response.pipe(file);
    r.on('finish', function () {
        var pathToPdf = __dirname + "/"+path.basename(uri);

        

        pdfText(pathToPdf, function(err, chunks) {
            chunks = getNumber(chunks);
            chunks = getVersion(chunks);
            chunks = getTitle(chunks);
            chunks = getBeats(chunks);
            chunks = getSubTitle(chunks);
            chunks = resetFirstLetter(chunks);
            chunks = getCopyright(chunks);
            chunks = getAuthor(chunks);
            chunks = seperateToVerses(chunks);
            hymnObj.tune = "";

            collection.insert(hymnObj, {w: 1}, function(err, result){
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted '+hymnObj.number);
              }
              //Close connection
              
            });
          //chunks is an array of strings 
          //loosely corresponding to text objects within the pdf

          //for a more concrete example, view the test file in this repo
        });
    });
});
