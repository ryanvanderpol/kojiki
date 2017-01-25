const _ = require('underscore'),
      Promise = require('bluebird'),
      Connection = require('../../lib/data/connection');

angular.module('kojiki').factory('ConnectionService', ['$rootScope', '$timeout', 'SessionService', function($rootScope, $timeout, SessionService){

        class Service{

            constructor(){
                this.session = null;
            }

            save(connection){
                console.log(`[ConnectionService][${connection.name}] saving connection`);
                SessionService.save();
                $timeout(() => $rootScope.$broadcast('connection.save', connection));
            }

            connect(connection){
                return this.execute(connection, 'SELECT 1;')
                    .then(() => $timeout(() => $rootScope.$broadcast('connection.reset', connection)));
            }

            edit(connection){
                return new Promise((resolve, reject) => {
                    let handler = $rootScope.$on('connection.save', (event, connection) => {
                        handler(); // unsubscribe
                        resolve(connection);
                    });
                    $timeout(() => $rootScope.$broadcast('connection.edit', connection));
                });
            }

            execute(connection, query){
                return connection.getClient().query(query);
            }

            listTables(connection){
                return connection.getClient().listTables();
            }
        }

        return new Service();
    }
]);