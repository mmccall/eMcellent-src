//Requires modules to perform the actual cleaning.
var rtnSemantics = require('./rtnSemantics.js');


//Exports allow access in app.js
exports.mParse = mParse;


//Function designed to handle multi-line inputs.
function mParse (inputCode) {
//Count the lines and iterate each one.
//TODO:  Only handling line feeds, may want to expand to Carriage Returns as well.
var returnCode = "";
var splitLines = inputCode.split("\n");

  if (splitLines.length === 1) {
  //Since only 1 line, not considered routine.  Parsing applied without routine considerations.
  	console.log(splitLines[0]);
    var inputCode = mParseLine(splitLines[0]);
    console.log(inputCode);
    return inputCode;
  } else {
  //Walk each line.
  for (i=0;i<splitLines.length;i++) {
  	//Ignore every comment line.
  	if (splitLines[i].substring(0,1) === ";") {
  		console.log("Comment on line " + i + " ignored.")
  		returnCode = returnCode + splitLines[i] + "\r" + "\n";
  	} else {
  		//If 1st letter is space, something is amiss, since no routine starts with a space.
  	  if (splitLines[i].substring(0,1) === " " && i === 0) {
		returnCode="ERROR: LEADING SPACE IN ROUTINE TITLE."
   	    return returnCode;
   	  } else {
   	  	console.log("here!");
  			  returnCode = returnCode + mParseLine(splitLines[i]) + "\r" + "\n";
      }
  	}
   }
  return returnCode;
  }
 }

//Function designed to handle single lines driven from mParse.
function mParseLine (inputCode) {

	var inputCode = rtnSemantics.deTerse(inputCode, 'WRITE');

return inputCode;
}