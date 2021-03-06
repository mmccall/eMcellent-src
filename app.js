/*---------------------------------------------------------------------------
Copyright 2013 Matthew McCall.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
---------------------------------------------------------------------------*/

/* Express dependencies */
var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

/* M Parsing Package Dependencies. */
var mParsing = require('./app/mParsing.js');

/* M Rendering Package Depency. */
var mRender = require('./app/mRender.js');

/* Package listing import dependency. */
var mPackages = require('./app/mPackages.js');

/* Package listing import dependency. */
var mGlobals = require('./app/mGlobals.js');

/* Persistence dependencies */
var mongoose = require('mongoose');

/* Mongo Connection */
var conn = mongoose.connect('mongodb://localhost/mdb', function(err) {
  if (!err) {
    console.log("Connected to MongoDB");
  } else {
    throw err;
  }
});

/* Mongo Schema and Code Declaration */
var mSchema = new mongoose.Schema ({
  mCode: String,
  mCodeOutput: Object,
  mCodeProcessFlag: Number
});

var mModel = mongoose.model('mCode', mSchema);

//Import Packages List to JSON and persist.
var mPackageLocation = "./source_data/Packages.csv";
var mPackageJSON = mPackages.importPackages(mPackageLocation);

//Import Globals List from Directory to JSON and persist.
//Only returns a list of loaded globals, not full values.
var mVistaDirectory = "./source_data/"
var mGlobalsJSON = mGlobals.importGlobals(mVistaDirectory);

/*Create Express app and Configure*/
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/favicon.png'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/* Post page load routines in Mongo, queries for and selects response when ready. */

app.post('/', function(req, res) {

var mCodeModel = new mModel({mCode: req.body.inputCode, mCodeProcessFlag: 0, mCodeOutput: ""});
var mCodeInput = req.body.inputCode;
var mCodeJSON = "";
var mCodeHTML = "";

try {
mParsing.mParse(req.body.inputCode, function(mParseResponse) {
  mCodeJSON = mParseResponse;
  mCodeHTML = mRender.mRender(mParseResponse);
  res.render('index', { title: 'eMcellent.', codeResponse:{codeValue: mCodeJSON}, codeInput:{codeValue: mCodeInput}, codeMUMPS:mCodeHTML});
});
//Persisting queries for later analysis.
saveRec(mCodeJSON);
} catch (error) {
console.log(error);
mCodeJSON = {Error: error};
mCodeHTML = "<span class=\"errorMessage\">Error: " + error + "</span>";
res.render('index', { title: 'eMcellent.', codeResponse:{codeValue: mCodeJSON}, codeInput:{codeValue: mCodeInput}, codeMUMPS:mCodeHTML});
}

//Build the response.
//Added for testing, may want to remove in production.
mModel.collection.drop();

function saveRec (mCodeOutput) {
  mCodeModel.save(function (err) {
    if (!err) {
      console.log('Post Saved');
      mCodeModel.update({mCodeProcessFlag: 1, mCodeOutput: mCodeOutput}, function (err, numberAffected, raw) {
        if (err) return err;
        console.log('The number of updated documents was %d', numberAffected);
        console.log('The raw response from Mongo was ', raw);
      });
    } else {
      throw err;
    }
  });
} 

//Not currently used, may revisit later.
function findRec (mCodeQuery) {
    var mQuery = mModel.findOne(mCodeQuery);
    mQuery.select('mCode mCodeProcessFlag mCodeOutput') 
    mQuery.exec(function (err, qResponse) {
        if (err) throw err;
        do
        var temp = 1;
        while(qResponse.mCodeProcessFlag === 0)

        //console.log(codeMUMPS);
    });
  }
});

//Home page Loading.
app.get('/', function(req, res) {
  var codeInput = {codeValue: "%HWRLD ;Creates 'HELLO WORLD' Message. \n W \"HELLO WORLD\""}
  var codeResponse = {codeValue:"OUTPUT HERE"}
  var codeMUMPS = mRender.mRender(codeResponse.codeValue);
  res.render('index', { title: 'eMcellent.', codeResponse:codeResponse, codeInput:codeInput, codeMUMPS:codeMUMPS});
});

//Server Instantiation.
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

