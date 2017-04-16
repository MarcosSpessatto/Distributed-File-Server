(function () {
    'use strict';
    angular.module('file-server')
        .controller('FileServerController', FileServerController);

    FileServerController.$inject = ['fileserverservice', '$location'];
    function FileServerController(fileserverservice, $location) {
        var vm = this;
        vm.name = '';
        vm.isLoading = false;
        vm.upload = upload;


        function upload(file){
            vm.isLoading = true;
            fileserverservice.sendFile(file, vm.name).then(function (response) {
                    console.log(response)
                vm.isLoading = false;
                Materialize.toast(response.data.descricaoRetorno, 4000)
                if(response.data.codRetorno === 0){
                    $location.path('/my-files')
                }
            }).catch(function (err) {
                vm.isLoading = false;
                Materialize.toast(err.data, 4000)
            });
        }
    }
})();