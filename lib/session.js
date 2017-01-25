const shortid = require('shortid'),
      Connection = require('./data/connection');

class Session{
    constructor(json){
        json = json || {};

        this.id = json.id || shortid.generate();
        this.connection = json.connection ? new Connection(json.connection) : new Connection();
        this.queries = json.queries || [];
    }
}

module.exports = Session;