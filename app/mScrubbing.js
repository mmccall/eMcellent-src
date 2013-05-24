
exports.deTerse = deTerse;

function deTerse (inputJSON) {

//Listing of full name of all MUMPS Commands.
var arrayFunctions = ['BREAK', 'CLOSE', 'DO', 'ELSE', 'FOR', 'GOTO', 'HALT', 'HANG', 'IF', 'JOB', 'KILL', 'LOCK', 'MERGE', 'NEW', 'OPEN', 'QUIT', 'READ', 'SET', 'TCOMMIT', 'TRESTART', 'TROLLBACK', 'TSTART', 'USE', 'VIEW', 'WRITE', 'XECUTE'];


for (var i in inputJSON.mCode) {
  for (var ii in inputJSON.mCode[i].commands) {
    for (iii=0;iii<arrayFunctions.length;iii++) {
      //console.log(inputJSON.mCode[i].commands[ii].function)
      //console.log(arrayFunctions[iii]);
      if (arrayFunctions[iii].substring(0,inputJSON.mCode[i].commands[ii].function.length) === inputJSON.mCode[i].commands[ii].function) {
        inputJSON.mCode[i].commands[ii]["functionFullName"] = arrayFunctions[iii];
      }
    }
  }
}

return inputJSON;
}