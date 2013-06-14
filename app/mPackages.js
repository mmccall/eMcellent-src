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

exports.appendPackageData = appendPackageData;
exports.importPackages = importPackages;

var fs = require('fs'),
mongodb = require("mongodb");



//Function parses JSON response and outputs all pretty like.
function appendPackageData (inputJSON, callback) {

	var processFlag = 0;
	var returnJSON = {};
	
	//Retrieve Package Data from MongoDB.
	mongodb.connect("mongodb://localhost/mdb", function(err, db) {
    	var collection = db.collection('packages', function(err, coll) {
    	if (err) throw err;
    		var packageQuery = coll.find().toArray(function(err, packagesArray) {
    			
    			var prefixArray = [];
    			//Extract all prefixes.
    			for (i=0;i<packagesArray.length;i++) {
    				if (packagesArray[i].prefixes) {
    					prefixArray.push(packagesArray[i].prefixes);
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
    			for (i=0;i<packagesArray.length;i++) {
    				if (packagesArray[i].prefixes) {
    					if (inputJSON.mCode[0].vistaPrefixes === packagesArray[i].prefixes) {
    						if (packagesArray[i]["packageName"]) {
								inputJSON.mCode[0]["vistaPackageName"] = packagesArray[i]["packageName"];
							}
							if (packagesArray[i]["directoryName"]) {
								inputJSON.mCode[0]["vistaDirectoryName"] = packagesArray[i]["directoryName"];
							}
							if (packagesArray[i]["fileNumbers"]) {
								inputJSON.mCode[0]["vistaFileNumbers"] = packagesArray[i]["fileNumbers"];
							}
							if (packagesArray[i]["fileNames"]) {
								inputJSON.mCode[0]["vistaFileNames"] = packagesArray[i]["fileNames"];
							}
							if (packagesArray[i]["globals"]) {
								inputJSON.mCode[0]["vistaGlobals"] = packagesArray[i]["globals"];
							}
							if (packagesArray[i]["vdlID"]) {
								inputJSON.mCode[0]["vistaDocID"] = packagesArray[i]["vdlID"];
							}
    					}
    				}
    			}
    		callback(inputJSON);
    		});
    	});
    });
};

							/*
							if (packagesArray[i]["packageName"]) {
								inputJSON.mCode[0]["vistaPackageName"] = packagesArray[i]["packageName"];
							}
							if (packagesArray[i]["directoryName"]) {
								inputJSON.mCode[0]["vistaDirectoryName"] = packagesArray[i]["directoryName"];
							}
							if (packagesArray[i]["prefixes"]) {
								inputJSON.mCode[0]["vistaPrefixes"] = packagesArray[i]["prefixes"];
							}
							if (packagesArray[i]["fileNumbers"]) {
								inputJSON.mCode[0]["vistaFileNumbers"] = packagesArray[i]["fileNumbers"];
							}
							if (packagesArray[i]["fileNames"]) {
								inputJSON.mCode[0]["vistaFileNames"] = packagesArray[i]["fileNames"];
							}
							if (packagesArray[i]["globals"]) {
								inputJSON.mCode[0]["vistaGlobals"] = packagesArray[i]["globals"];
							}
							if (packagesArray[i]["vdlID"]) {
								inputJSON.mCode[0]["vistaDocID"] = packagesArray[i]["vdlID"];
							}*/
						




function importPackages (inputFile) {

	var packageLineJSON = {};
	var packageArray = [];
	var packageJSON = {};

	fs.readFile(inputFile, 'utf-8', function(err, data) {
		if (err) throw err;
		var splitFile = data.split("\n");
		for (i=1;i<splitFile.length;i++) {
			var splitLine = splitFile[i].split(",");
			if (splitLine[0]) {
				packageLineJSON["packageName"] = splitLine[0];
			}
			if (splitLine[1]) {
				packageLineJSON["directoryName"] = splitLine[1];
			}
			if (splitLine[2]) {
				packageLineJSON["prefixes"] = splitLine[2];
			}
			if (splitLine[3]) {
				packageLineJSON["fileNumbers"] = splitLine[3];
			}
			if (splitLine[4]) {
				packageLineJSON["fileNames"] = splitLine[4];
			}
			if (splitLine[5]) {
				packageLineJSON["globals"] = splitLine[5];
			}
			if (splitLine[6]) {
				packageLineJSON["vdlID"] = splitLine[6];
			}
		packageArray.push(packageLineJSON);
		packageLineJSON = {};
		}

	//Persist to MongoDB.
	mongodb.connect("mongodb://localhost/mdb", function(err, db) {
    	var collection = db.createCollection('packages', function(err, coll) {
    		if (err) throw err;
    		coll.remove(function(err, result) {
    			coll.insert(packageArray, {w:1}, function(err, result) {
    			if (err) throw err;
    			console.log("Package table loaded");
    			});
    		});
    	});
    });

	packageJSON["packages"] = packageArray;
	return packageJSON;
	});

};

