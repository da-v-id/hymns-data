var http = require('http');
var fs = require('fs');
var pdfText = require('pdf-text');
var cheerio = require("cheerio");
var request = require("request");
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var path = require('path');

var urlsArray = [];

/*request({
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
});*/



function buildDB(){
    MongoClient.connect('mongodb://127.0.0.1:27017/hymns', function(err, db) {
        if(err) throw err;

        var collection = db.collection('hymns');

        urlsArray.forEach(function(element, index, array){
            processPdf(element);
        });

//processPdf(urlsArray[urlsArray.length-1]);
        
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

            function getNumber(array){
                hymnObj.number = array.splice(0,1)[0];
                return array;
            }

            function getVersion(array){
                if((array[0].indexOf("(")!==(-1)) && (array[0].indexOf(")")!==(-1))){
                    hymnObj.version = array.splice(0,1)[0].replace('(','').replace(')','');
                }
                else{
                    hymnObj.version = "";
                }
                
                return array;
            }

            function getTitle(array){
                if(!(array[0].match(/\d/g))&&(array[0].length)>5){
                    hymnObj.title = array.splice(0,1)[0];
                }
                else{

                }
                
                return array;
            }

            function getBeats(array){
                hymnObj.beats = array.splice(0,1)[0];
                return array;
            }

            function getSubTitle(array){
                if((array[0].indexOf("(")!==(-1)) && (array[0].indexOf(")")!==(-1))){
                    hymnObj.subtitle = array.splice(0,1)[0];
                }
                else{
                    hymnObj.subtitle = "";
                }
                return array;
            }

            function resetFirstLetter(array){
                var firstLetter = array.splice(array.length-1,1);
                array[0] = firstLetter + array[0];
                return array;
            }

            function getCopyright(array){
                if(array[array.length-1].indexOf('©')!==(-1)){
                    hymnObj.copyright = array.splice(array.length-1,1)[0].replace('©').trim();
                }   
                else{
                    hymnObj.copyright = "";
                }     
                return array;
            }

            function getAuthor(array){
                hymnObj.author = array.splice((array.length-1),1)[0];
                return array;
            }

            function seperateToVerses(array){
                var num = null;
                var finalNum = 0;
                var verse = [];
                var verses = [];
                array.forEach(function(element, index, a){
                    num = element.match(/\d/g);
                    if(num){
                        finalNum = num;
                        verses.push(verse);
                        verse = [];
                    }
                    var tmpElem = element.replace(/\d+/g, '');
                    verse.push(tmpElem.trim());
                    num = null;
                });
                verses.push(verse);
                hymnObj.numberOfVerses = finalNum[0];
                hymnObj.verses = verses;
                return verses;
            }
        }

        //db.close();

    });
}
