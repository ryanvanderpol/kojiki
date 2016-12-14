const angular = require('angular');

const app = angular.module('kojiki', ['angular-loading-bar','ui.codemirror', 'ui.grid',  'ui.grid.resizeColumns', 'ui.grid.autoResize']);
                                        

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);

app.run(['$rootScope', function($rootScope){
    angular.element(document).ready(() => {
        $rootScope.$broadcast('app.run');
    });
}]);

module.exports = app;