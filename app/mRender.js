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
	var outputHTMLLineTipContent = "";

	for (var i in inputJSON.mCode) {

		//Handle Labels.
		if (inputJSON.mCode[i].lineNumber === 0) {
			outputHTMLLineTipContent = "<h4>VistA Information</h4>"
			if (inputJSON.mCode[i].vistaPackageName) {
				outputHTMLLineTipContent = outputHTMLLineTipContent + "<p>VistA Package Name:</br>" + inputJSON.mCode[i].vistaPackageName + "</p>"
			}
			if (inputJSON.mCode[i].vistaDirectoryName) {
				outputHTMLLineTipContent = outputHTMLLineTipContent + "<p>VistA Directory Name:</br>" + inputJSON.mCode[i].vistaDirectoryName + "</p>"
			}
			if (inputJSON.mCode[i].vistaFileNumbers) {
				outputHTMLLineTipContent = outputHTMLLineTipContent + "<p>VistA File Number(s):</br>" + inputJSON.mCode[i].vistaFileNumbers + "</p>"
			}
			if (inputJSON.mCode[i].vistaFileNames) {
				outputHTMLLineTipContent = outputHTMLLineTipContent + "<p>VistA File Name(s):</br>" + inputJSON.mCode[i].vistaFileNames + "</p>"
			}
			if (inputJSON.mCode[i].vistaGlobals) {
				outputHTMLLineTipContent = outputHTMLLineTipContent + "<p>VistA Globals:</br>" + inputJSON.mCode[i].vistaGlobals + "</p>"
			}
			if (inputJSON.mCode[i].vistaDocID) {
				outputHTMLLineTipContent = outputHTMLLineTipContent + "<p>VistA Document ID:</br>" + inputJSON.mCode[i].vistaDocID + "</p>"
			}

			outputHTMLLineLabel = "<a class=\"lineLabel\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"<span class='lead'> Routine: " + inputJSON.mCode[i].lineLabel + "</span>\" data-html=true data-content=\""+ outputHTMLLineTipContent + "\">" + inputJSON.mCode[i].lineLabel + "</a>";
			outputHTMLLine = outputHTMLLine + outputHTMLLineLabel + "\t";
		} else if (inputJSON.mCode[i].lineLabel) {
			outputHTMLLineLabel = "<a class=\"lineLabel\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"<span class='lead'> Label: " + inputJSON.mCode[i].lineLabel + "</span>\" data-html=true>" + inputJSON.mCode[i].lineLabel + "</a>";
			outputHTMLLine = outputHTMLLine + outputHTMLLineLabel + "\t";
		} else {
			outputHTMLLineLabel = "\t"
			outputHTMLLine = outputHTMLLine + outputHTMLLineLabel;
		}

		//Handle Indentation.
		if (inputJSON.mCode[i].lineIndentation > 0) {
			outputHTMLLineIndentation = "<a class=\"lineIndentation\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Line Indentation\">" + "....................".substring(0, inputJSON.mCode[i].lineIndentation) + "</a>";
			outputHTMLLine = outputHTMLLine + outputHTMLLineIndentation + " ";
		}

		//Handle Commands.
		if (inputJSON.mCode[i].commands) {
			for (var ii in inputJSON.mCode[i].commands) {	

				//Handle Command Parameters.
				if (inputJSON.mCode[i].commands[ii].parameterString !== null && inputJSON.mCode[i].commands[ii].parameterString !== undefined) {
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
			if (ii < inputJSON.mCode[i].commands.length - 1) {
				outputHTMLLine = outputHTMLLine + outputHTMLLineCommand + " ";
			} else {
				outputHTMLLine = outputHTMLLine + outputHTMLLineCommand;
			} 
			outputHTMLLineCommandParameters = "";
			outputHTMLLineCommandPostConditionals = "";
			}
		} 

		//Handle Comments.
		if (inputJSON.mCode[i].lineComment && inputJSON.mCode[i].commands) {
			outputHTMLLineComment = "<a class=\"lineComment\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Comment\">;" + inputJSON.mCode[i].lineComment + "</a>";
			outputHTMLLine = outputHTMLLine + " " + outputHTMLLineComment;
		} else if (inputJSON.mCode[i].lineComment) {
			outputHTMLLineComment = "<a class=\"lineComment\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Comment\">;" + inputJSON.mCode[i].lineComment + "</a>";
			outputHTMLLine = outputHTMLLine + outputHTMLLineComment;
		//Fix for empty lines to have a comment marker.
		} else if (outputHTMLLine === "\t") {
			outputHTMLLineComment = "<a class=\"lineComment\" data-toggle=\"tooltip\" data-trigger=\"hover\" data-placement=\"top\" title=\"Comment\">;</a>";
			outputHTMLLine = outputHTMLLine + outputHTMLLineComment;
		}

	outputHTMLLine = outputHTMLLineStart + outputHTMLLine + outputHTMLLineEnd;
	outputHTML = outputHTML + outputHTMLLine + "\n";
	outputHTMLLine = "";
	}
	return outputHTML;
}