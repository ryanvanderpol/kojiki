const _ = require('underscore'),
      $ = require('jquery'),
      Client = require('../../lib/data/client'),
      Query = require('../../lib/data/query'),
      config = new (require('electron-config'))();

angular.module('kojiki').controller('QueryController', ['$scope', '$timeout', 'SessionService', function($scope, $timeout, SessionService){
    
    $scope.session = null;
    $scope.connection = null;
    $scope.client = null;
    $scope.codemirrorInstance = null;

    $scope.selectedQuery = null;

    $scope.error = null;
    $scope.working = false;

    $scope.editorOptions = {
        lineWrapping : false,
        lineNumbers: true,
        indentUnit: 4,
        smartIndent: true,
        indentWithTabs: true,
        mode: 'text/x-pgsql'
    };

    $scope.gridOptions = {
        columnDefs: []
    };

    $scope.$watch('selectedQuery.text', () => SessionService.save());

    $scope.$watch('selectedQuery.results', () => {
        if($scope.selectedQuery){
            if($scope.selectedQuery.columns){
                $scope.gridOptions.columnDefs = [];
                _.each($scope.selectedQuery.columns, col => {
                    if(col.name) {
                        $scope.gridOptions.columnDefs.push({ name: col.name, displayName: col.name, width: 150 });
                    }
                });
            }
            $scope.gridOptions.data = $scope.selectedQuery.results;
            $timeout(() => resizeGrid());
            // save the updated results to the session file
            SessionService.save();
        }
    });

    $scope.go = function(){
        var query = $scope.codemirrorInstance.getSelection();
        if(!query){
            query = $scope.selectedQuery.text;
        }

        $scope.working = true;
        $scope.client.query(query)
              .tap(results => console.log(results))
              .then(results => $scope.readResults(results))
              .then(() => $timeout(() => { $scope.error = null; $scope.working = false; }))
              .catch(err => $timeout(() => $scope.onError(err)));
    };

    $scope.onError = function(err){
        $scope.working = false;
        console.log(err.toString());
        $scope.error = err.message;
    };

    $scope.readResults = function(results){
        let rows = results.rows;
        let cols = _.uniq(results.fields, col => col.name);

        $scope.selectedQuery.columns = [];
        $scope.selectedQuery.results = [];
        $scope.selectedQuery.command = results.command;
        $scope.selectedQuery.affectedRows = results.rowCount;

        $timeout(() => {
            if(cols && cols.length > 0){
                $scope.selectedQuery.results = rows;
                $scope.selectedQuery.columns = cols;
            }
        });
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

    let init = function(){

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

        $scope.$on('session.activatequery', (event, query) => {
            $scope.selectQuery(query);
            $scope.go();
        });

        $(window).on('resize', () => resizeGrid());
    };

    let resizeGrid = function(){
        let height = $(window).height() - $('.data-grid').offset().top - 10; // 10 = bottom padding
        $('.data-grid').height(height);
    };

    $scope.codemirrorLoaded = function(cm){
        $scope.codemirrorInstance = cm;
    };

    init();

}]);

