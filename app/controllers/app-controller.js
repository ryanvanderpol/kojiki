const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      Client = require('../../lib/data/client')
      config = new (require('electron-config'))();


angular.module('kojiki').controller('AppController', ['$scope', '$rootScope', 'ConnectionService', 'SessionService', function($scope, $rootScope, ConnectionService, SessionService){
    
    $scope.sessions = [];
    $scope.activeSession = null;

    $scope.addSession = function(){
        $scope.activeSession = SessionService.createSession();
    };

    $scope.activateSession = function(session){
        $scope.activeSession = session;

        ConnectionService.ensureConnection($scope.activeSession).then(connection => {
            ConnectionService.connect(connection);
            SessionService.save();
            SessionService.activate($scope.activeSession);
        });
    };

    $scope.clearConfig = function(){
        config.clear();
    };

    var init = function(){
        $scope.$on('app.run', () => {
            console.log('Booting up...');

            $scope.sessions = SessionService.getSessions();
            $scope.activateSession(SessionService.getActiveSession());
        });
    };

    init();

}]);
