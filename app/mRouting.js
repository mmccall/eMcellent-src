//Requires modules to perform the actual cleaning.
var mScrubbing = require('./mScrubbing.js');

//Exports allow access in app.js
exports.mParse = mParse;

//This function deconstructs the text-based input into a JSON Array.
function mParse (inputCode) {
  //Count the lines and iterate each one.
  var returnArray = [];
  var returnCode = {};
  var splitLines = inputCode.split("\r\n");
  var returnCommArray = [];

  //Instantiate all variables.
  var lineNum = null;
  var lineLabel = "";
  var lineExpression = "";
  var lineComment = "";
  var lineIndentation = "";
  var lineCommands = [];
  var lineRoutines = [];
  var lineParams = [];
  var linePostConditional = "";

  //Walk each line.
  for (i=0;i<splitLines.length;i++) {
    //Extract Line Number.
    lineNum = i;

    //Extract Line Label.
    if (splitLines[i].substring(0,1) === " ") {
    lineLabel = "";
    lineExpression = splitLines[i].substring(1);
    } else {
     var arrayLabels = splitLines[i].split(" ", 1);
     lineLabel = arrayLabels[0] + " ";
     lineExpression = splitLines[i].substring(lineLabel.length);
    }

    //Extract Line Comments.
    if (lineExpression.search(";") >= 0) {
      for (posComm=0;posComm<lineExpression.length;posComm++) {
        if (lineExpression[posComm] === ";") {
          if ((lineExpression.substring(0,posComm).split("\"").length % 2 !== 0) && (lineExpression.substring(posComm).split("\"").length % 2 !== 0)) {
          lineComment = lineExpression.substring(posComm);
          lineExpression = lineExpression.replace(lineComment, "");
          }
        }
      }
    }

    //Extract Indentation.
    if (lineExpression.substring(0,1) === ".") {
    lineIndentation = lineExpression.split(" ", 1)[0];
    lineExpression = lineExpression.substring(lineIndentation.length + 1);
    lineIndentation = lineIndentation.length;
    } else {
      lineIndentation = 0;
    }

    //Extract Expressions to array.
    var prePosLE = 0
    for(posLE=0;posLE <= lineExpression.length;posLE++) { 
      if (lineExpression[posLE] === " ") {
        if ((lineExpression.substring(0,posLE).split("\"").length % 2 !== 0) && (lineExpression.substring(posLE).split("\"").length % 2 !== 0)) {
        lineCommands.push(lineExpression.substring(prePosLE,posLE));
        prePosLE = posLE + 1;
        }
      } else if (posLE === lineExpression.length) {
      lineCommands.push(lineExpression.substring(prePosLE,posLE));
      prePosLE = 0;
      }
    }
    //Extract Routines & Arguments.
    var lineCommandArray = [];
    var lineFuncArray = [];
    for (posLC=0;posLC<lineCommands.length;posLC++) {
      if (posLC % 2 === 0) {
      lineFuncArray.push(lineCommands[posLC]);
      } else {
      lineFuncArray.push(lineCommands[posLC]);
      lineCommandArray.push(lineFuncArray);
      lineFuncArray = [];
      }
      //Last command doesn't always require parameter, so if Odd Number of Pairs, push it.
      if (lineCommands.length % 2 !== 0 && lineCommands.length > 0 && posLC === (lineCommands.length - 1)) {
      lineCommandArray.push(lineFuncArray);
      lineFuncArray = [];
      }
    }

    //Extract PostConditionals from functions.        
    for (posPC=0;posPC<lineCommandArray.length;posPC++) {
      if (lineCommandArray[posPC][0].match(":") !== null) {
      linePostConditional = lineCommandArray[posPC][0].substring(lineCommandArray[posPC][0].split(":")[0].length + 1);
      lineCommandArray[posPC][0] = lineCommandArray[posPC][0].split(":")[0];
      lineCommandArray[posPC].push(linePostConditional);
      }
    }

    var lineJSON = {
    "lineNumber": lineNum,
    "lineIndentation": lineIndentation,
    }

    if (lineLabel !== "") {lineJSON["lineLabel"] = lineLabel};
    if (lineComment !== "") {lineJSON["lineComment"] = lineComment};

    if (lineCommandArray) {
      for (posJSON=0;posJSON<lineCommandArray.length;posJSON++) {  
      var commJSON = {};
      commJSON["commandNumber"] = posJSON;
        for (posJSON1=0;posJSON1<lineCommandArray[posJSON].length;posJSON1++) {
          if (posJSON1 === 0) {
          commJSON["function"] = lineCommandArray[posJSON][posJSON1];
          } else if (posJSON1 === 1) {
          commJSON["parameters"] = lineCommandArray[posJSON][posJSON1];
          } else if (posJSON1 === 2) {
          commJSON["postConditionals"] = lineCommandArray[posJSON][posJSON1];
          }
        }
      returnCommArray.push(commJSON);
      }
    }

  lineJSON["commands"] = returnCommArray;
  returnArray.push(lineJSON);

  //Wipe used variables.
  lineLabel = "";
  lineIndentation = "";
  parseResults = "";
  lineComment = "";
  lineNum = null;
  lineCommands = [];
  returnCommArray = [];

  }
  //Function Level descriptors.
  returnCode["mCode"] = returnArray;
  //console.log(returnCode);
  //Perform Scrubbing on JSON Object.
  returnCode = mScrubbing.deTerse(returnCode);


  //console.log("FINAL RETURN: " + returnCode);
  return returnCode;
}