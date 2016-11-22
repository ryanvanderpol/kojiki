const angular = require('angular');

const app = angular.module('kojiki', ['angular-loading-bar']);
                                        

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);

module.exports = app;
const App = require('./app'),
      MainController = require('./controllers/main-controller'),
      SidebarController = require('./controllers/sidebar-controller');

const _ = require('underscore'),
      Client = require('../../../lib/data/client'),
      config = new (require('electron-config'))();



(function(){
    angular.module('kojiki').controller('MainController', ['$scope', '$filter', function($scope, $filter){
        
        $scope.connection = null;
        $scope.query = 'select * from users limit 10';
        $scope.client = null;

        $scope.data = [];
        $scope.columns = [];

        $scope.go = function(){
            var query = window.getSelection().toString();
            if(!query){
                query = $scope.query;
            }

            $scope.client.query(query)
                  .then(results => {
                        $scope.readResults(results.rows);
                  })
                  .catch(err => {
                        console.log(err);
                  });
        };

        $scope.readResults = function(rows){
            $scope.data = rows;

            if(rows && rows.length > 0){
                var ex = rows[0];
                $scope.columns = _.keys(ex);
            }

            // i think this is necessary since we run the query async
            $scope.$apply();
        };

        $scope.onQueryKeypress = function($event){
            if($event.keyCode === 13 && $event.metaKey){
                $scope.go();
            }
        };

        var init = function(){

            $scope.connection = config.get('connection');

            if(!$scope.client){
                config.set('connection', $scope.connection);
                $scope.client = new Client($scope.connection);
            }


        };

        init();

    }]);
})();

const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      config = new (require('electron-config'))();


angular.module('kojiki').controller('SidebarController', ['$scope', '$filter', function($scope, $filter){
    
    $scope.connection = null;
    $scope.query = 'select * from users limit 10';
    $scope.client = null;

    $scope.data = [];
    $scope.columns = [];

    $scope.go = function(){
        var query = window.getSelection().toString();
        if(!query){
            query = $scope.query;
        }

        $scope.client.query(query)
              .then(results => {
                    $scope.readResults(results.rows);
              })
              .catch(err => {
                    console.log(err);
              });
    };


    var init = function(){

        $scope.connection = config.get('connection');

        if(!$scope.client){
            config.set('connection', $scope.connection);
            $scope.client = new Client($scope.connection);
        }

        $scope.client.listTables().then(data => {
            console.log(data);
        });
    };

    init();

}]);
