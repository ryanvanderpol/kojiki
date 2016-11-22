const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      Client = require('../../lib/data/client'),
      Connection = require('../../lib/data/connection'),
      config = new (require('electron-config'))();


angular.module('kojiki').controller('ConnectionController', ['$scope', '$rootScope', 'ConnectionService', function($scope, $rootScope, connectionService){
    
    $scope.visible = false;

    $scope.connection = null;

    $scope.save = function(){
        if($scope.connection.isValid()){
            connectionService.connect($scope.connection);
            $scope.visible = false;
        }
        else {
            console.log('invalid connection');
        }
    };

    var init = function(){
        $scope.$on('connection.edit', (event, connection) => {
            console.log('Editing connection', connection);
            $scope.visible = true;
            $scope.connection = connection;
        });
    };

    init();

}]);
