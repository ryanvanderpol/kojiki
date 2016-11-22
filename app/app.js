const angular = require('angular');

const app = angular.module('kojiki', ['angular-loading-bar']);
                                        

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);

app.run(['$rootScope', function($rootScope){
    angular.element(document).ready(() => {
        $rootScope.$broadcast('app.run');
    });
}]);

module.exports = app;