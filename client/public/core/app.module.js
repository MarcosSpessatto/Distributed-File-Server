(function () {
    'use strict';
    angular.module('file-server', [
        'ngFileUpload',
        'ngRoute'
    ])
        .config(config);

    config.$inject = ['$routeProvider', '$qProvider'];
    function config($routeProvider, $qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
        $routeProvider
            .when("/new-file", {
                templateUrl: "core/file-server/new/send.html",
                controller: "FileServerController",
                controllerAs: 'file'
            })
            .when("/my-files", {
                templateUrl: "core/file-server/files/all.html",
                controller: "FilesServerController",
                controllerAs: 'files'
            })
            .otherwise({redirectTo: '/my-files'});
    }
})();