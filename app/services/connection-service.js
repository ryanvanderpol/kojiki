const _ = require('underscore'),
      Promise = require('bluebird'),
      Connection = require('../../lib/data/connection');

angular.module('kojiki').factory('ConnectionService', ['$rootScope', '$timeout', 'SessionService', function($rootScope, $timeout, SessionService){

        class Service{

            constructor(){
                this.session = null;
            }

            ensureConnection(session){
                console.log(session);
                this.session = session;
                if(!this.session.connection || !this.session.connection.isValid()){
                    
                    this.session.connection = this.session.connection || new Connection();

                    return new Promise((reject, resolve) => {
                        $rootScope.$on('connection.connected', (event, connection) => {
                            resolve(connection);
                        });
                        this.editConnection(this.session.connection);
                    });
                }
                else {
                    return Promise.resolve(this.session.connection);
                }
            }

            connect(connection){
                this.session.connection = connection;
                console.log('saving connection');
                SessionService.save();
                $rootScope.$broadcast('connection.connected', this.session.connection);
            }

            editConnection(connection){
                $timeout(() => $rootScope.$broadcast('connection.edit', connection));
            }
        }

        return new Service();
    }
]);