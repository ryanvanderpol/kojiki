const Client = require('./client'),
      parseDbUri = require('parse-database-url');

class Connection{
    constructor(json){
        json = json || {};

        this.type = json.type || 'pg';
        this.name = json.name || 'New Connection';
        this.isUri = json.isUri || false;

        this.uri = json.uri;
        this.host = json.host;
        this.port = json.port;
        this.user = json.user;
        this.password = json.password;
        this.database = json.database;
        this.ssl = json.ssl;

        // hide _client from JSON serializer
        let _client = new Client(this);
        this.getClient = function(){
            return _client;
        };
    }

    parseUri(uri){
        let drivers = {
            postgres: 'pg',
            mysql: 'mysql'
        };

        var parts = parseDbUri(uri);
        this.type = drivers[parts.driver];
        this.database = parts.database;
        this.user = parts.user;
        this.password = parts.password;
        this.port = parts.port;
        this.host = parts.host;
        this.ssl = parts.ssl == 'true';
    }

    isValid(){
        if(this.isUri)
            return (this.uri && this.uri.length > 0);
        else {
            if(this.host && this.port && this.user && this.password && this.database) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Connection;