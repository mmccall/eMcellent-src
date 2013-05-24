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

exports.deTerse = deTerse;

function deTerse (inputJSON) {

//Listing of full name of all MUMPS Commands.
var arrayCommands = ['BREAK', 'CLOSE', 'DO', 'ELSE', 'FOR', 'GOTO', 'HALT', 'HANG', 'IF', 'JOB', 'KILL', 'LOCK', 'MERGE', 'NEW', 'OPEN', 'QUIT', 'READ', 'SET', 'TCOMMIT', 'TRESTART', 'TROLLBACK', 'TSTART', 'USE', 'VIEW', 'WRITE', 'XECUTE'];
//Listing of full name of intrinsic functions, with the exception of $Z.  Will be handled otherwise.
var arrayIntrinsicFunctions = ['$ASCII', '$CHAR', '$DATA', '$EXTRACT', '$FIND', '$FNUMBER', '$GET', '$JUSTIFY', '$LENGTH', '$NAME', '$ORDER', '$PIECE', '$QLENGTH', '$QSUBSCRIPT', '$QUERY', '$RANDOM', '$REVERSE', '$SELECT', '$STACK', '$TEXT', '$TRANSLATE', '$VIEW'];

for (var i in inputJSON.mCode) {
  for (var ii in inputJSON.mCode[i].commands) {
    for (iii=0;iii<arrayCommands.length;iii++) {
      //console.log(inputJSON.mCode[i].commands[ii].function)
      //console.log(arrayFunctions[iii]);
      if (arrayCommands[iii].substring(0,inputJSON.mCode[i].commands[ii].function.length) === inputJSON.mCode[i].commands[ii].function) {
        inputJSON.mCode[i].commands[ii]["functionFullName"] = arrayCommands[iii];
      }
    }
  }
}

return inputJSON;
}