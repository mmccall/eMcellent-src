exports.mRender = mRender;

//Function parses JSON response and outputs all pretty like.
function mRender (inputJSON) {
	var outputHTML = "";
	var outputHTMLLine = "";
	for (var i in inputJSON.mCode) {
		if (inputJSON.mCode[i].lineLabel) {
			console.log(inputJSON.mCode[i].lineNumber);
			outputHTMLLine = "<span class=\"lineLabel\">" + inputJSON.mCode[i].lineLabel + "</span>";
		} else {
			outputHTMLLine = "";
		}
	outputHTML = outputHTML + "<span class=\"mCode\">" + outputHTMLLine + "</span>" + "\n";
	}
	return outputHTML;
}