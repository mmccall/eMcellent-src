
exports.deTerse = deTerse;

function deTerse (inputString, inputWord) {
  var inputLength = inputString.length;

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

return inputString;
}