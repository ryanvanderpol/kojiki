const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      Client = require('../../lib/data/client'),
      Query = require('../../lib/data/query'),
      config = new (require('electron-config'))();


angular.module('kojiki').controller('SidebarController', ['$scope', '$rootScope', 'ConnectionService', 'SessionService', function($scope, $rootScope, connectionService, SessionService){
    
    $scope.session = null;
    $scope.connection = null;
    $scope.client = null;

    $scope.tables = [];

    $scope.selectTable = function(table){
    	console.log(table);
    };

    $scope.selectTableRows = function(table){
    	let q = new Query();
    	q.text = `SELECT * FROM ${table} limit 100`;
    	$scope.session.queries.push(q);
    	SessionService.activateQuery(q);
    };

    $scope.editConnection = function(){
    	connectionService.editConnection($scope.connection);
    };

    var prep = function(){
		$scope.connection = $scope.session.connection;

		$scope.client = $scope.connection.getClient();

		$scope.client.listTables().then(data => {
		    //$scope.tables = data.map(o => o.tablename);
		    $scope.tables = data;
		    $scope.$apply();
		});
    };

    var init = function(){

    	$scope.$on('session.activate', (event, session) => {
    		$scope.session = session;
    		prep();
    	});

    };

    init();

}]);
