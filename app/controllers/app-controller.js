const _ = require('underscore'),
      knex = require('knex'),
      angular = require('angular'),
      Client = require('../../lib/data/client')
      Connection = require('../../lib/data/connection'),
      config = new (require('electron-config'))();


angular.module('kojiki').controller('AppController', ['$scope', '$rootScope', '$timeout', 'ConnectionService', 'SessionService', function($scope, $rootScope, $timeout, ConnectionService, SessionService){
    
    $scope.sessions = [];
    $scope.activeSession = null;

    $scope.addSession = function(){
        SessionService.createSession().then(session => {
            if(session){
                let handler = $rootScope.$on('connection.save', (event, connection) => {
                    if(connection && typeof(connection.isValid == 'function') && connection.isValid()){
                        activateValidSession(session);
                    }
                    else{
                        console.log('[App] Closing invalid session');
                        SessionService.closeSession(session);
                        refreshSessions();
                    }
                    // remove handler
                    handler();
                });
                $timeout(() => $rootScope.$broadcast('connection.edit', session.connection));
            }
        });
    };

    let activateValidSession = function(session){
        $scope.activeSession = session;
        ConnectionService.connect(session.connection)
            .then(() => $timeout(() => SessionService.activate($scope.activeSession)))
            .catch(err => {
                console.log('[App] Session activation failed', err);
                $timeout(() => {
                    SessionService.closeSession(session);
                    refreshSessions();
                    $scope.activateSession(SessionService.getActiveSession());
                });
            });
    };

    $scope.activateSession = function(session){
        if(session){
            if(session.connection && session.connection.isValid()){
                activateValidSession(session);
            }
            else {
                if(!session.connection){
                    session.connection = new Connection();
                }
                ConnectionService.edit(session.connection).then(() => {
                    $scope.activateSession(session);
                })
                .catch(err => { console.log('[App]', err); });
            }
        }
        else {
            $scope.addSession();
        }
    };

    $scope.clearConfig = function(){
        config.clear();
    };

    let refreshSessions = function(){
        $scope.sessions = SessionService.getSessions();
    };

    var init = function(){
        $scope.$on('app.run', () => {
            console.log('[App] Booting up...');

            refreshSessions();
            $scope.activateSession(SessionService.getActiveSession());
        });

        $scope.$on('session.remove', ($event, session) => {
            console.log('[App] Removing session', session);

            SessionService.closeSession(session);
            refreshSessions();
            var nextSession = SessionService.getActiveSession();
            if(nextSession)
                $scope.activateSession(nextSession);
            else {
                // no sessions left.  create a new one.
                $scope.addSession();
            }
        });
    };

    init();

}]);
