
/* Express dependencies */
var express = require('express')
  , http = require('http')
  , path = require('path');

/* Persistence dependencies */
/* var fs = require('fs'); */
var mongoose = require('mongoose');

/* Mongo Connection */
mongoose.connect('mongodb://localhost/mdb', function(err) {
  if (!err) {
    console.log("Connected to MongoDB");
  } else {
    throw err;
  }
});

/* Mongo Schema and Code Declaration */
var mSchema = new mongoose.Schema ({
  mCode: String,
  mCodeOutput: String,
  mCodeLintFlag: Number
});

var mModel = mongoose.model('mCode', mSchema);

/*Create Express app and Configure*/
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
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

var mCodePost = new mModel({mCode: req.body.inputCode, mCodeLintFlag: 0, mCodeOutput: ""});

function findRec (qReq) {
  var mQuery = mModel.findOne(qReq)
  mQuery.select('mCode mCodeLintFlag mCodeOutput') 
  mQuery.exec(function (err, qResponse) {
        if (err) throw err;
        do
        console.log('waiting...');
        //TODO:  Swap to 0 as it gets set to 1 post processing.
        while(qResponse.mCodeLintFlag === 0)
        var codeResponse = {codeValue: qResponse.mCodeOutput}
        var codeInput = {codeValue: qResponse.mCode}
      res.render('index', { title: 'eMcellent.', codeResponse:codeResponse, codeInput:codeInput});

  });
}

function saveRec (qReq) {
  mCodePost.save(function (err) {
    if (!err) {
      console.log('Post Saved');
      lintMCode(req.body.inputCode);
      findRec({mCode: req.body.inputCode});
    } else {
      throw err;
    }
  });
}

saveRec();


//Master function passed values for linting.

function lintMCode (mCode) {

//Lint it up.
var results = lintWRITE(mCode);
//Load up the original file.
mCodePost.update({mCodeLintFlag: 1, mCodeOutput: results}, function (err, numberAffected, raw) {
  if (err) return err;
  //console.log('The number of updated documents was %d', numberAffected);
  //console.log('The raw response from Mongo was ', raw);
  });
}

//Sub-linter for WRITE.
function lintWRITE (inputString) {
  var inputLength = inputString.length;
  var inputWord = "WRITE";

  for (i=0;i<inputLength;i++) {
    //RULE:  If 1st character is W, walk to next space and evaluate if the string is "WRITE"
    if (inputString[i] === inputWord[0] && i === 0) {
      //Start from the 1st Character and walk forward to the next space.
      for (ii=0;ii<inputLength - i; ii++) {
        if (inputString[i+ii] === " ") {
          //Take string, and compare results to inputWord.
          if (inputString.substring(i,i+ii) === inputWord.substring(0,ii)) {
            //Make it equal to the reference word.
            inputString = inputString.slice(0, i) + inputWord + inputString.slice(i+ii);
          }
        }
      }
    }
  }

return inputString;
}


});

app.get('/', function(req, res) {
  var codeInput = {codeValue:"W HELLO WORLD!"}
  var codeResponse = {codeValue:"OUTPUT HERE"}
  res.render('index', { title: 'eMcellent.', codeResponse:codeResponse, codeInput:codeInput});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

