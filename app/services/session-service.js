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
                console.log('activating session', session);
                this.activeSession = session;
                $timeout(() => $rootScope.$broadcast('session.activate', session));
            }

            getSessions(){
                return this.sessions;
            }

            save(){
                console.log('saving sessions');
                config.set('sessions', this.sessions);
            }

            createSession(){
                var session = new Session();
                this.sessions.push(session);
                this.save();
                return session;
            }

            closeSession(session){
                this.sessions = _.without(this.sessions, session);
            }

            getActiveSession(){
                return this.activeSession;
            }
        }

        return new Service();
    }
]);