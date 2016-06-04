
'use strict';
//https://github.com/danialfarid/ng-file-upload/wiki/Direct-S3-upload-and-Node-signing-example

angular.module('shared-components').directive('bsgFileUpload', function () {

    return {
        restrict: 'E',
        scope: {
            onSuccessfulUpload: '&',
            propertyName: '@'
        },
        templateUrl: 'shared/public/modules/shared-components/views/bsg-file-upload.shared-components.directive.view.html',
        controller: function($scope, $http, Upload){
            $scope.onFileSelect = function(files) {
                if(!$scope.onSuccessfulUpload){
                    console.error('Cannot upload file. onSuccessfulUpload handler missing');
                    return;
                }
                if (files && files.length > 0) {
                    var filename = files[0].name;
                    var type = files[0].type;
                    var query = {
                        filename: filename,
                        type : type
                    };
                    $http.post('/get-s3-upload-url', query)
                        .success(function(result) {

                            Upload.upload({
                                url: result.url, //s3Url
                                transformRequest: function(data, headersGetter) {
                                    var headers = headersGetter();
                                    delete headers.Authorization;
                                    return data;
                                },
                                fields: result.fields, //credentials
                                method: 'POST',
                                file: files[0]
                            }).progress(function(evt) {
                                console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
                            }).success(function(data, status, headers, config) {
                                // file is uploaded successfully
                                console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
                                $scope.onSuccessfulUpload()($scope.propertyName, filename, result.fields.key);
                            }).error(function(err) {
                                console.error('Error occured while uploading the file', err);
                            });
                        })
                        .error(function(data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.error('Error occured during the metadata setup before uploading the file');
                        });
                }
            };
        }
    };
});