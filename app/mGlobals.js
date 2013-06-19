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
function importGlobals (inputDir) {

	var globalLineJSON = {};
	var globalArray = [];
	var globalJSON = {};

	fs.readFile(inputFile, 'utf-8', function(err, data) {
		if (err) throw err;
		var splitFile = data.split("\n");
		for (i=1;i<splitFile.length;i++) {
			var splitLine = splitFile[i].split(",");
			if (splitLine[0]) {
				globalLineJSON["globalName"] = splitLine[0];
			}
			if (splitLine[1]) {
				globalLineJSON["directoryName"] = splitLine[1];
			}
			if (splitLine[2]) {
				globalLineJSON["prefixes"] = splitLine[2];
			}
			if (splitLine[3]) {
				globalLineJSON["fileNumbers"] = splitLine[3];
			}
			if (splitLine[4]) {
				globalLineJSON["fileNames"] = splitLine[4];
			}
			if (splitLine[5]) {
				globalLineJSON["globals"] = splitLine[5];
			}
			if (splitLine[6]) {
				globalLineJSON["vdlID"] = splitLine[6];
			}
		globalArray.push(globalLineJSON);
		globalLineJSON = {};
		}

	//Persist to MongoDB.

	/*mongodb.connect("mongodb://localhost/mdb", function(err, db) {
    	var collection = db.createCollection('globals', function(err, coll) {
    		if (err) throw err;
    		coll.remove(function(err, result) {
    			coll.insert(globalArray, {w:1}, function(err, result) {
    			if (err) throw err;
    			console.log("Global table loaded");
    			});
    		});
    	});
    });*/

	globalJSON["globals"] = globalArray;
	return globalJSON;
	});

};

