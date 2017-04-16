(function () {
    'use strict';
    angular.module('file-server')
        .factory('fileserverservice', fileserverservice);

    fileserverservice.$inject = ['$http', 'Upload', '$q'];
    function fileserverservice($http, Upload, $q) {
        return {
            sendFile: sendFile,
            getFiles: getFiles,
            getFile: getFile,
            deleteFile: deleteFile
        };

        function sendFile(file, name) {
            var data = {file: file, name: name};
            return $q(function (resolve, reject) {
                Upload.upload({
                    url: '/api/upload',
                    method: 'POST',
                    data: data
                }).then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }

        function getFiles() {
            return $http.get('/api/files');
        }

        function getFile(file) {
            return $http.get('/api/file/' + file);
        }

        function deleteFile(file) {
            return $http.delete('/api/file/delete/' + file);
        }
    }
})();