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
var lineCommands = [];
var lineRoutines = [];
var lineParams = [];

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
   	  		//Extract Line Comments.
   	  		//TODO:  Filter only checks for a leading quote.  Should fix for trailing quote as well.
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
            lineExpression = lineExpression.substring(lineIndentation.length);
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
        
        //Split array alternating as routines/arguments.
        for (posLC=0;posLC<lineCommands.length;posLC++) {
          if (posLC % 2 === 0) {
            console.log("COMMAND:" + lineCommands[posLC]);
          } else {
            console.log("PARAM:" + lineCommands[posLC]);
          }

        }



          //Execute Parsing
   	  		var parseResults = mParseLine(lineExpression);
   	  		//console.log("OUTPUT: " + parseResults);
  	   	}

        //console.log("LINE NUMBER: \"" + lineNum + "\"");
        //console.log("LINE LABEL: \"" + lineLabel + "\"");
        //console.log("LINE INDENT: \""  + lineIndentation  + "\"");
        //console.log("LINE RESULTS: \""  + parseResults  + "\"");
        //console.log("LINE COMMENT: \""  + lineComment  + "\"");
  	   	returnCode = returnCode + lineLabel + lineIndentation + parseResults + lineComment + "\r\n";

         //Wipe used variables.
         lineLabel = "";
         lineIndentation = "";
         parseResults = "";
         lineComment = "";
         lineNum = null;
         lineCommands = [];
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