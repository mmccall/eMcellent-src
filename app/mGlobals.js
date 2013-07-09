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

exports.appendGlobalData = appendGlobalData;
exports.importGlobals = importGlobals;

var fs = require('fs'),
mongodb = require("mongodb");

//Function parses JSON response and outputs all pretty like.
function appendGlobalData (inputJSON, callback) {

	var processFlag = 0;
	var returnJSON = {};
	
	//Retrieve Package Data from MongoDB.
	mongodb.connect("mongodb://localhost/mdb", function(err, db) {
    	var collection = db.collection('globals', function(err, coll) {
    	if (err) throw err;
    		var globalQuery = coll.find().toArray(function(err, globalsArray) {
    			
    			var prefixArray = [];
    			//Extract all prefixes.
    			for (i=0;i<globalsArray.length;i++) {
    				if (globalsArray[i].prefixes) {
    					prefixArray.push(globalsArray[i].prefixes);
    				}
    			}

    			prefixArray.sort(function(a,b) {return (b.length - a.length)})

    			//Grab routine name from input.
    			var routineLabel = inputJSON.mCode[0].lineLabel

				for (i=0;i<prefixArray.length;i++) {
					if (routineLabel.substring(0,prefixArray[i].length) === prefixArray[i]) {
						inputJSON.mCode[0]["vistaPrefixes"] = prefixArray[i];
					}
    			}
    			for (i=0;i<globalsArray.length;i++) {
    				if (globalsArray[i].prefixes) {
    					if (inputJSON.mCode[0].vistaPrefixes === globalsArray[i].prefixes) {
    						if (globalsArray[i]["globalName"]) {
								inputJSON.mCode[0]["vistaPackageName"] = globalsArray[i]["globalName"];
							}
							if (globalsArray[i]["directoryName"]) {
								inputJSON.mCode[0]["vistaDirectoryName"] = globalsArray[i]["directoryName"];
							}
							if (globalsArray[i]["fileNumbers"]) {
								inputJSON.mCode[0]["vistaFileNumbers"] = globalsArray[i]["fileNumbers"];
							}
							if (globalsArray[i]["fileNames"]) {
								inputJSON.mCode[0]["vistaFileNames"] = globalsArray[i]["fileNames"];
							}
							if (globalsArray[i]["globals"]) {
								inputJSON.mCode[0]["vistaGlobals"] = globalsArray[i]["globals"];
							}
							if (globalsArray[i]["vdlID"]) {
								inputJSON.mCode[0]["vistaDocID"] = globalsArray[i]["vdlID"];
							}
    					}
    				}
    			}
    		callback(inputJSON);
    		});
    	});
    });
};

//Function will recursively scan all directories in a VistA-M based repository.
//Input takes the base directory.
function importGlobals (inputDir) {

	var vistaDirectory = inputDir + "Packages/"
	var globalJSON = {};
	var globalArray = [];
	var globalFileJSON = {};
	var globalFileJSONArray = [];
	var globalFileJSONArrayJSON = {};
	var currentDir = "";

	fs.readdir(vistaDirectory, function(err, files) {
		if (err) throw err;
		for (i=0; i<files.length;i++) {
			var fileStats = fs.statSync(vistaDirectory + files[i]);
			if (fileStats.isDirectory()) {
				currentDir = vistaDirectory + files[i] + "/";
				var packageFiles = fs.readdirSync(currentDir);
				for (ii=0;ii<packageFiles.length;ii++) {
					//Ignore hidden files.
					if(packageFiles[ii].substring(0,1) !== ".") {
						var subFileStats = fs.statSync(currentDir + packageFiles[ii]);
						if (subFileStats.isDirectory() && packageFiles[ii] === "Globals") {
						var currentSubDir = currentDir + packageFiles[ii] + "/"
						var globalFiles = fs.readdirSync(currentSubDir);
							for (iii=0;iii<globalFiles.length;iii++) {
								if (globalFiles[iii].substring(globalFiles[iii].length - 4) === ".zwr") {
									globalFileJSON["vistaGlobalPackage"] = files[i];
									var fileContents = fs.readFileSync(currentSubDir + globalFiles[iii], 'utf-8');
									var fileContents = fileContents.split("\n");
									globalFileJSON["vistaGlobalFileName"] = fileContents[0];
									globalFileJSON["vistaGlobalNumberSpace"] = "2";
									//Skip 2 lines, 1 for file name, and 1 for ZWR command.
									for (iiii=2;iiii<fileContents.length;iiii++) {
										//Reset skip line for globalNumber Assignment.
										globalFileJSONArrayJSON["vistaGlobalAssignmentNumber"] = iiii - 2;
										//Separate Global from assignment.
										if (fileContents[iiii]) {
											var fileContentsSplit = fileContents[iiii].split("=");
											if (fileContentsSplit[0] !== '""' && fileContentsSplit[0]) {
												globalFileJSONArrayJSON["vistaGlobalAssignment"] = fileContentsSplit[0];
												//TODO:  Further Split.
											}
											if (fileContentsSplit[1] !== '""' && fileContentsSplit[1]) {
												globalFileJSONArrayJSON["vistaGlobalAssignmentValue"] = fileContentsSplit[1];
												//TODO:  Further Split.
											}
										globalFileJSONArray.push(globalFileJSONArrayJSON);
										globalFileJSONArrayJSON = {};
										}
									}
								globalFileJSON["vistaGlobalAssignments"] = globalFileJSONArray;
								globalArray.push(globalFileJSON);
								//console.log(globalArray);
								globalFileJSON = {};
								}
							} 
						}
					}
				}
			}
		}
		//Persist to MongoDB.
		//Should have pre-qualifier for dropping, not part of this callback cycle.
		mongodb.connect("mongodb://localhost/mdb", function(err, db) {
    		var collection = db.createCollection('vistaGlobal', {w:1}, function(err, globalCollection) {
    		if (err) throw err;
    		globalCollection.remove({}, {w:1}, function(err, result) {
    		if (err) throw err;
    		/*globalCollection.count(function(err, count) {
    			console.log(count);
    		});*/
    		for (i=0;i<globalArray.length;i++) {
    			globalCollection.insert(globalArray[i], {w:1}, function(err, result) {
    			if (err) throw err;
    			console.log("Global Loaded: " + result[0].vistaGlobalPackage + " - " + result[0].vistaGlobalFileName);
    			});
    		};
    		});

    	    });
    	});

globalJSON["vistaGlobals"] = globalArray;
return globalJSON;
	});
};

