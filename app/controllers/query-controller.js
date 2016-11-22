const _ = require('underscore'),
      Client = require('../../lib/data/client'),
      Query = require('../../lib/data/query'),
      config = new (require('electron-config'))();

angular.module('kojiki').controller('QueryController', ['$scope', '$filter', 'SessionService', function($scope, $filter, SessionService){
    
    $scope.session = null;
    $scope.connection = null;
    $scope.client = null;

    $scope.selectedQuery = null;

    $scope.editorOptions = {
        lineWrapping : false,
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        indentWithTabs: true,
        mode: 'text/x-pgsql'
    };

    $scope.$watch('selectedQuery.text', () => SessionService.save());

    $scope.go = function(){
        var query = window.getSelection().toString();
        if(!query){
            query = $scope.selectedQuery.text;
        }

        $scope.client.query(query)
              .then(results => {
                    $scope.readResults(results.rows);
              })
              .catch(err => {
                    console.log(err);
              });
    };

    $scope.readResults = function(rows){
        $scope.selectedQuery.results = rows;

        if(rows && rows.length > 0){
            var ex = rows[0];
            $scope.selectedQuery.columns = _.keys(ex);
        }

        // i think this is necessary since we run the query async
        $scope.$apply();
    };

    $scope.onQueryKeypress = function($event){
        if($event.keyCode === 13 && $event.metaKey){
            $scope.go();
        }
    };

    $scope.addQuery = function(){
        $scope.selectedQuery = new Query();
        $scope.session.queries.push($scope.selectedQuery);

        SessionService.save();
    };

    $scope.selectQuery = function(query){
        $scope.selectedQuery = query;
    };

    $scope.removeQuery = function(query){
        if($scope.selectedQuery == query){
            var i = $scope.session.queries.indexOf(query) - 1;
            if(i < 0) i = 0;

            let sq = $scope.session.queries[i];
            $scope.selectQuery(sq);
        }

        $scope.session.queries = _.without($scope.session.queries, query);

        if($scope.session.queries.length == 0){
            $scope.addQuery();
        }
    };

    var init = function(){

        $scope.$on('session.activate', (event, session) => {
            $scope.session = session;
            $scope.connection = session.connection;
            $scope.client = $scope.connection.getClient();

            console.log($scope.client.connection);

            if($scope.session.queries.length == 0){
                $scope.addQuery();
            }
            else {
                $scope.selectQuery($scope.session.queries[0]);
            }
        });
    };

    init();

}]);

