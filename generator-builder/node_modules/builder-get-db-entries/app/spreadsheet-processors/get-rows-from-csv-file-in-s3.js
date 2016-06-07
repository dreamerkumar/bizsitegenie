'use strict';

/**
 * Module dependencies.
 */
var csv = require('csv'),
	aws = require('aws-sdk'),
	s3Config = require('../../../../../website/config/s3.amazonaws').getConfig(),
	csv = require('csv'),
	Q = require('q');

/*
* @inputParams {featureId: ..., spreadsheetEntries: ..}
*/
exports.getCsvRowsForFeatureSpreadsheetRows = function(inputParams){
	
   var index = 0;
   var columns = null;
   var columnData = [];
   var rows = inputParams.spreadsheetEntries;
   var featureId = inputParams.featureId;

    return Q.Promise(function(resolve, reject) {

        function next() {
            if (index < rows.length) {
                exports.getSpreadsheetFromAws(rows[index].fileKey)
                .then(function(data){
                	var invalid = false;
                	if(data && data.length > 0){
                		var cols = data[0];
                		if(columns === null){
                			if(cols && cols.length > 0){
                				columns = cols;
                			} else {
                				rows[index].status = 'invalid: no data found';
                				invalid = true;
                			}
                		} else {
                			if(cols.length != columns.length) {
                				rows[index].status = 'invalid: number of columns do not match';
                				invalid = true;
                			}
                		}
                	} else {
                		rows[index].status = 'invalid: no data found';
                		invalid = true;
                	}

                	if(!invalid && data && data.length > 1){
                		data.splice(0,1);
                		columnData = columnData.concat(data);
                	} else {
                		if(!invalid){
                			rows[index].status = 'nodata: header was present but no data was found';
                		}
                		invalid = true;
                	}

                	if(!invalid){
                		rows[index].status = 'processed';
                	}

                	index++;
                	next();
                })
                .catch(function(err){reject(err)});
            } else {
                var results = {columns: columns, data: columnData};
                resolve({featureId: featureId, spreadsheetEntries: rows, spreadsheetData: results});
            }
        }
        next();
    });
};

//can be tested from command line after uncommenting below line
//exports.getCsvRowsForFeatureSpreadsheetRows([{fileKey:'default/sample.csv'}, {fileKey:'default/sample1.csv'}, {fileKey: 'default/samplewithextracol.csv'}]).then(function(results){console.log(results)}).catch(function(error){console.log(error)});

exports.getSpreadsheetFromAws = function(fileKey) {    
    return Q.Promise(function(resolve, reject, notify) {

        if(!fileKey || !fileKey.length){
            reject('Cannot get csv data from s3. Missing file key.');
            return;
        }
        try {
            aws.config.update({accessKeyId: s3Config.AWS_ACCESS_KEY, secretAccessKey: s3Config.AWS_SECRET_KEY});

            var s3 = new aws.S3();

            var options = {
                Bucket: s3Config.S3_BUCKET,
                Key: fileKey
            };
       
            var fileStream = s3.getObject(options).createReadStream();
            
            var parser = csv.parse({delimiter: ','}, function(err, data){
                if(err){
                    reject(err);
                } else {
                    resolve(data);
                }
            });

            fileStream.pipe(parser);
        } catch (err){
            reject(err.message);
        }
    });
};

//can be tested from command line after uncommenting below line
//exports.getSpreadsheetFromAws(process.argv[2]).then(function(results){console.log(results)}).catch(function(error){console.log(error)});
