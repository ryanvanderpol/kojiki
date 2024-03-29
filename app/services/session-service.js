const _ = require('underscore'),
      config = new (require('electron-config'))(),
      Promise = require('bluebird'),
      Session = require('../../lib/session');

angular.module('kojiki').factory('SessionService', ['$rootScope', '$timeout', function($rootScope, $timeout){

        class Service{

            constructor(){
                var sessions = config.get('sessions') || [];
                if(sessions.length == 0){
                    sessions.push(new Session());
                }
                else {
                    sessions = sessions.map(s => new Session(s));
                }
                this.sessions = sessions;
                this.activeSession = this.sessions[0];
            }

            activate(session){
                console.log('[SessionService] Activating session', session);
                this.activeSession = session;
                $timeout(() => $rootScope.$broadcast('session.activate', session));
            }

            getSessions(){
                return this.sessions;
            }

            save(){
                console.log('[SessionService] Saving sessions');
                config.set('sessions', this.sessions);
            }

            createSession(){
                var session = new Session();
                session.connection.isUri = true; // default to URIs
                this.sessions.push(session);
                this.save();
                return Promise.resolve(session);
            }

            closeSession(session){
                this.sessions = _.without(this.sessions, session);
                this.save();
            }

            getActiveSession(){
                if(this.sessions.indexOf(this.activeSession) < 0)
                    this.activeSession = this.sessions[0];

                return this.activeSession;
            }

            activateQuery(query){
                $timeout(() => $rootScope.$broadcast('session.activatequery', query));
            }
        }

        return new Service();
    }
]);