const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      Query = require('../../lib/data/query'),
      config = new (require('electron-config'))();


angular.module('kojiki').controller('SidebarController', ['$scope', '$rootScope', '$timeout', 'ConnectionService', 'SessionService', function($scope, $rootScope, $timeout, ConnectionService, SessionService){
    
    $scope.session = null;
    $scope.connection = null;

    $scope.connected = false;
    $scope.tables = [];

    $scope.selectTable = function(table){
    	console.log(table);
    };

    $scope.selectTableRows = function(schema, table, count){
    	let q = new Query();
    	if(!schema || schema == 'public')
	    	q.text = `SELECT * \nFROM ${table} \nLIMIT ${count}`;
	    else
	    	q.text = `SELECT * \nFROM ${schema}.${table} \nLIMIT ${count}`;
    	$scope.session.queries.push(q);
    	SessionService.activateQuery(q);
    };

    $scope.editConnection = function(){
    	ConnectionService.edit($scope.connection);
    };

    $scope.removeConnection = function(){
    	$timeout(() => $rootScope.$broadcast('session.remove', $scope.session));
    };

    $scope.refreshTables = function(){
    	$scope.tables = [];
    	listTables();
    };

    var listTables = function(){
    	ConnectionService.listTables($scope.connection).then(data => {
			$scope.connected = true;
		    $scope.tables = data;
		    $scope.$apply();
		})
		.catch(err => {
			console.log(err);
			$timeout(() => $rootScope.$broadcast('connection.error', err));
		});
    };

    var prep = function(){
		$scope.connection = $scope.session.connection;

		listTables();
    };

    var init = function(){

    	$scope.$on('session.activate', (event, session) => {
    		$scope.connected = false;
    		$scope.session = session;
    		prep();
    	});

    	$scope.$on('connection.save', (event, connection) => {
    		if(connection == $scope.connection){
    			//prep();
    		}
    	});

    };

    init();

}]);
