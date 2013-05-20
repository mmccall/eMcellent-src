//Requires modules to perform the actual cleaning.
var rtnSemantics = require('./rtnSemantics.js');


//Exports allow access in app.js
exports.mParse = mParse;


//Function designed to handle multi-line inputs.
function mParse (inputCode) {
//Count the lines and iterate each one.
//TODO:  Only handling line feeds, may want to expand to Carriage Returns as well.
var returnCode = "";
var splitLines = inputCode.split("\r\n");
var lineLabel = "";
var lineExpression = "";
var lineComment = "";

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
     	returnCode = returnCode + splitLines[i] + "\r\n";
  	} else {
  		//If 1st letter is space, something is amiss, since no routine starts with a space.
  	  if (splitLines[i].substring(0,1) === " " && i === 0) {
		returnCode="INVALID ROUTINE: LEADING SPACE IN ROUTINE TITLE."
   	    return returnCode;
   	  } else {
   	  	if (i > 0) {
   	  		//Extract Line Label, append as start of return code.
   	  		if (splitLines[i].substring(0,1) === " ") {
   	  			lineLabel = " ";
   	  			lineExpression = splitLines[i].substring(1);
   	  		} else {
   	  			var arrayLabels = splitLines[i].split(" ", 1);
   	  			lineLabel = arrayLabels[0] + " ";
   	  			lineExpression = splitLines[i].substring(lineLabel.length);
   	  		} 

   	  		//1st line never parsed since it should contain the routine name.
   		  	//console.log("LENGTH: " + splitLines.length);
   	  		//console.log("INPUT: " + splitLines[i]);
   	  		var parseResults = mParseLine(lineExpression);
   	  		//console.log("OUTPUT: " + parseResults);
  	   	 returnCode = returnCode + lineLabel + parseResults + "\r\n";
  	   	}
      }
  	}
   }
   //console.log("FINAL RETURN: " + returnCode);
  return returnCode;
  }
 }


//Function designed to handle single lines driven from mParse.
function mParseLine (inputCode) {

	var inputCode = rtnSemantics.deTerse(inputCode, 'WRITE');

return inputCode;
}