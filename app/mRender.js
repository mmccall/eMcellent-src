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

exports.mRender = mRender;

//Function parses JSON response and outputs all pretty like.
function mRender (inputJSON) {
	var outputHTML = "";
	var outputHTMLLine = "";
	var outputHTMLLineLabel = "";
	var outputHTMLLineComment = "";
	var outputHTMLLineIndentation = "";
	var outputHTMLLineCommand = "";
	var outputHTMLLineCommandParameters = "";
	var outputHTMLLineCommandPostConditionals = "";
	var outputHTMLLineStart = "<span class=\"line\">";
	var outputHTMLLineEnd = "</span>";


	for (var i in inputJSON.mCode) {

		//Handle Labels.
		if (inputJSON.mCode[i].lineLabel) {
			outputHTMLLineLabel = "<a class=\"lineLabel\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Label\">" + inputJSON.mCode[i].lineLabel + "</a>";
			outputHTMLLine = outputHTMLLine + outputHTMLLineLabel;
		}

		//Handle Indentation.
		if (inputJSON.mCode[i].lineIndentation > 0) {
			outputHTMLLineIndentation = "<a class=\"lineIndentation\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Line Indentation\">" + "....................".substring(0, inputJSON.mCode[i].lineIndentation) + "</a>";
			outputHTMLLine = outputHTMLLine + " " + outputHTMLLineIndentation;
		}

		//Handle Commands.
		if (inputJSON.mCode[i].commands) {
			for (var ii in inputJSON.mCode[i].commands) {	

				//Handle Command Parameters.
				if (inputJSON.mCode[i].commands[ii].parameterString) {
					outputHTMLLineCommandParameters = "<a class=\"lineParameters\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Parameters\">" + inputJSON.mCode[i].commands[ii].parameterString + "</a>";
				}

				//Handle Post Conditionals.
				if (inputJSON.mCode[i].commands[ii].postConditionals) {
					outputHTMLLineCommandPostConditionals = "<a class=\"linePostConditionals\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Post Conditional(s)\">:" + inputJSON.mCode[i].commands[ii].postConditionals + "</a>";
				}

			outputHTMLLineCommand = "<a class=\"lineCommand\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"<span class='lead'> Command: " + inputJSON.mCode[i].commands[ii].commandFullName + "</span>\" data-html=true data-content=\"Syntax:<pre>" + inputJSON.mCode[i].commands[ii].commandSyntax + "</pre></br><p>" + inputJSON.mCode[i].commands[ii].commandDescription + "</p>\">" + inputJSON.mCode[i].commands[ii].command + "</a>";
			
			if (outputHTMLLineCommandParameters) {
				outputHTMLLineCommand = outputHTMLLineCommand + outputHTMLLineCommandPostConditionals + " " + outputHTMLLineCommandParameters;
			} else {
				outputHTMLLineCommand = outputHTMLLineCommand + outputHTMLLineCommandPostConditionals;
			}
			outputHTMLLine = outputHTMLLine + " " + outputHTMLLineCommand;
			outputHTMLLineCommandParameters = "";
			outputHTMLLineCommandPostConditionals = "";
			}
		} 

		//Handle Comments.
		if (inputJSON.mCode[i].lineComment) {
			outputHTMLLineComment = "<a class=\"lineComment\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Comment\">;" + inputJSON.mCode[i].lineComment + "</a>";
			outputHTMLLine = outputHTMLLine + " " + outputHTMLLineComment;
		//Fix for empty lines to have a comment marker.
		} else if (outputHTMLLine.length === 0) {
			outputHTMLLineComment = "<a class=\"lineComment\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Comment\">;</a>";
			outputHTMLLine = outputHTMLLine + " " + outputHTMLLineComment;
		}

	outputHTMLLine = outputHTMLLineStart + outputHTMLLine + outputHTMLLineEnd;
	outputHTML = outputHTML + outputHTMLLine + "\n";
	outputHTMLLine = "";
	}
	return outputHTML;
}