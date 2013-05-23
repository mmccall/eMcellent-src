
exports.deTerse = deTerse;

function deTerse (inputJSON) {

//Listing of full name of all MUMPS routines.
var arrayFunctions = ['BREAK', 'CLOSE', 'DO', 'ELSE', 'FOR', 'GOTO', 'HALT', 'HANG', 'IF', 'JOB', 'KILL', 'LOCK', 'MERGE', 'NEW', 'OPEN', 'QUIT', 'READ', 'SET', 'TCOMMIT', 'TRESTART', 'TROLLBACK', 'TSTART', 'USE', 'VIEW', 'WRITE', 'XECUTE'];

//console.log(inputJSON.line0);
//console.log(inputJSON.line0.lineNumber);

for (var i in inputJSON.mCode) {
  for (var ii in inputJSON.mCode[i].commands) {
    for (iii=0;iii<arrayFunctions.length;iii++) {
      //console.log(inputJSON.mCode[i].commands[ii].function)
      //console.log(arrayFunctions[iii]);
      if (arrayFunctions[iii].substring(0,inputJSON.mCode[i].commands[ii].function.length) === inputJSON.mCode[i].commands[ii].function) {
        console.log("HIT!");
        inputJSON.mCode[i].commands[ii]["functionFullName"] = arrayFunctions[iii];
      }
    }
  console.log(inputJSON.mCode[i].commands);
  }
}


/*  var inputLength = inputString.length;

  for (iii=0;iii<inputLength;iii++) {
    //RULE:  If 1st character is W, walk to next space and evaluate if the string is "WRITE"
    if (inputString[iii] === inputWord[0] && iii === 0) {
      //Start from the 1st Character and walk forward to the next space.
      for (iiii=0;iiii<inputLength - iii; iiii++) {
        if (inputString[iii+iiii] === " ") {
          //Take string, and compare results to inputWord.
          if (inputString.substring(iii,iii+iiii) === inputWord.substring(0,iiii)) {
            //Make it equal to the reference word.
            inputString = inputString.slice(0, iii) + inputWord + inputString.slice(iii+iiii);
          }
        }
      }
    }
  }

*/

return inputJSON;
}