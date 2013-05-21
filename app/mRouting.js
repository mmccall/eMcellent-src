//Requires modules to perform the actual cleaning.
var rtnSemantics = require('./rtnSemantics.js');

//Exports allow access in app.js
exports.mParse = mParse;

//Beginning array storing list of MUMPS standard commands.
var arrayRoutines = {
  'rtnDo': 'DO',
  'rtnList': 'LIST',
  'rtnWrite': 'WRITE',
  'rtnSet': 'SET'
}



//Function designed to handle multi-line inputs.
function mParse (inputCode) {
//Count the lines and iterate each one.
//TODO:  Only handling line feeds, may want to expand to Carriage Returns as well.
var returnCode = "";
var splitLines = inputCode.split("\r\n");
var lineNum = null;
var lineLabel = "";
var lineExpression = "";
var lineComment = "";
var lineIndentation = "";

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
   	  	if (i === 0) {
          //Never Parse first line.
   	  		lineLabel = splitLines[i];
          lineNum = i;
   	  		parseResults = "";
   	  	} else {
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
   	  		//Extract Line Expression.
   	  		//TODO:  Filter only checks for a leading quote.  Should fix for trailing quote as well.
   	  		if (lineExpression.search(";") >= 0) {
   	  			var commentSplits = lineExpression.split(";");
   	  			var leadingQuoteFlag = 0;
   	  			var trailingQuoteFlag = 0;

   	  			for (comment=0;comment<commentSplits.length;comment++) {
   	  				var quotations = commentSplits[comment].split("\"");
   	  				if (quotations.length % 2 === 1) {
   	  					leadingQuoteFlag = 1;
   	  				}
   	  				if (leadingQuoteFlag === 1) {
   	  					lineComment = ";" + commentSplits[comment];
   	  				}
   	  			}
   	  		  lineExpression = lineExpression.replace(lineComment, "");
   	  		}

          //Extract Indentation.
          if (lineExpression.substring(0,1) === ".") {
            lineIndentation = lineExpression.split(" ", 1)[0];
            lineExpression = lineExpression.substring(lineIndentation.length);
            console.log("NEW EXPRESSION:" + lineExpression.substring(lineIndentation.length));
          }

          //Extract Expressions.


          //Assemble into JSON array.



          //Execute Parsing
   	  		var parseResults = mParseLine(lineExpression);
   	  		//console.log("OUTPUT: " + parseResults);
  	   	}

        console.log("LINE NUMBER: \"" + lineNum + "\"");
        console.log("LINE LABEL: \"" + lineLabel + "\"");
        console.log("LINE INDENT: \""  + lineIndentation  + "\"");
        console.log("LINE RESULTS: \""  + parseResults  + "\"");
        console.log("LINE COMMENT: \""  + lineComment  + "\"");
  	   	returnCode = returnCode + lineLabel + lineIndentation + parseResults + lineComment + "\r\n";

         //Wipe used variables.
         lineLabel = "";
         lineIndentation = "";
         parseResults = "";
         lineComment = "";
         lineNum = null;
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