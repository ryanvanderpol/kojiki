const Client = require('./client');

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

        // hide _client from JSON serializer
        let _client = new Client(this);
        this.getClient = function(){
            return _client;
        };
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