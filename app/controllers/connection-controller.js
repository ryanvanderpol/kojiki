const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      Client = require('../../lib/data/client'),
      Connection = require('../../lib/data/connection'),
      config = new (require('electron-config'))();


angular.module('kojiki').controller('ConnectionController', ['$scope', '$rootScope', '$timeout', 'ConnectionService', function($scope, $rootScope, $timeout, ConnectionService){
    
    $scope.visible = false;
    $scope.error = null;
    $scope.connection = null;

    $scope.save = function(){
        $scope.error = null;

    	if($scope.connection.isUri){
            if($scope.connection.uri)
        		$scope.connection.parseUri($scope.connection.uri);
            else {
                $scope.error = 'You must provide a valid URI';
                return;
            }
    	}
        if($scope.connection.isValid()){
            ConnectionService.connect($scope.connection)
            .then(() => ConnectionService.save($scope.connection))
            .then(() => $timeout(() => $scope.visible = false))
            .catch(err => {
                console.log(`[ConnectionController][${$scope.connection.name}] Error`, err);
                $timeout(() => $scope.error = err.message);
            });
        }
        else {
            $scope.error = 'Oops, something isn\'t right.';
            console.log(`[ConnectionController][${$scope.connection.name}] Invalid connection`);
        }
    };

    $scope.close = function(){
        $scope.visible = false;
        $scope.error = null;
        ConnectionService.save($scope.connection);
    };

    var init = function(){
        $scope.$on('connection.edit', (event, connection) => {
            console.log(`[ConnectionController][${connection.name}] Editing connection`, connection);
            $scope.visible = true;
            $scope.connection = connection;
        });
    };

    init();

}]);
