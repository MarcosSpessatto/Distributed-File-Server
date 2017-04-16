(function () {
    'use strict';
    angular.module('file-server')
        .controller('FilesServerController', FilesServerController);

    FilesServerController.$inject = ['fileserverservice'];

    function FilesServerController(fileserverservice) {
        var vm = this;
        vm.name = '';
        vm.isLoading = true;
        vm.files = [];
        vm.download = download;
        vm.deleteFile = deleteFile;

        init();

        function init() {
            getFiles();
        }

        function getFiles() {
            fileserverservice.getFiles().then(function (response) {
                vm.isLoading = false;
                if(response.data.codRetorno === 500){
                    Materialize.toast(response.data.descricaoRetorno, 4000);
                    vm.files = [];
                } else {
                    vm.files = response.data;
                }
            }).catch(function (err) {
                vm.isLoading = false;
            })
        }

        function download(file, filename) {
            vm.isLoading = true;
            fileserverservice.getFile(file.name).then(function (response) {
                    console.log(response)
                vm.isLoading = false;
                if(response.data.codRetorno === 1){
                    Materialize.toast(response.data.descricaoRetorno, 4000);
                } else {
                    var type = _getType(filename);
                    if(!filename.split('.')[1]){
                        Materialize.toast('Extensão não conhecida', 4000);
                        console.log(response)
                    } else {
                        var imageBase64 = response.data.conteudo;
                        var blob = b64toBlob(imageBase64, _getType(filename))
                        var blobUrl = URL.createObjectURL(blob);

                        var a = document.createElement('a');
                        a.href = window.URL.createObjectURL(blob);
                        a.download = filename;
                        a.click();
                    }
                }
            }).catch(function (err) {
                vm.isLoading = false;
            })
        }

        function deleteFile(file, index) {
            if (confirm('Tem certeza?')) {
                vm.isLoading = true;
                fileserverservice.deleteFile(file.name).then(function (response) {
                    vm.isLoading = false;
                    console.log(response)
                    Materialize.toast(response.data.descricaoRetorno, 4000);
                    if(response.data.codRetorno === 0){
                        vm.files.splice(index, 1);
                     }
                }).catch(function (err) {
                    vm.isLoading = false;
                })
            } 
        }

        function _getType(filename) {
            switch (filename.split('.')[1].toLowerCase()) {
                case 'pdf':
                    return 'application/pdf';
                case 'jpg':
                    return 'image/jpg';
                case 'jpeg':
                    return 'image/jpeg';
                case 'png':
                    return 'image/png';
                case 'mp3':
                    return 'audio/mp3';
                case 'wma':
                    return 'audio/wma';
                case 'gif':
                    return 'image/gif';
                case 'avi':
                    return 'video/avi';
                case 'mp4':
                    return 'image/mp4';
                case 'webm':
                    return 'image/webm';
                default:
                    return 'application/octet-stream';
            }
        }



        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {
                type: contentType
            });
            return blob;
        }
    }
})();