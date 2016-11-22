const shortid = require('shortid'),
      Connection = require('./data/connection');

class Session{
    constructor(json){
        json = json || {};

        this.id = json.id || shortid.generate();
        this.connection = json.connection ? new Connection(json.connection) : null;
        this.queries = json.queries || [];
    }
}

module.exports = Session;