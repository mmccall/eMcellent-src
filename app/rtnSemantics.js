
exports.deTerse = deTerse;

function deTerse (inputString, inputWord) {
  var inputLength = inputString.length;

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