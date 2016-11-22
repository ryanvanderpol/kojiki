const _ = require('underscore'),
      knex = require('knex'),
      config = new (require('electron-config'))();

class Client{
    constructor(connection){
        this.connection = connection;
        if(this.connection.isUri){
            this.knex = knex({ client: this.connection.type, connection: connection.uri });
        }
        else {
            this.knex = knex({ client: this.connection.type, connection: connection });
        }
    }

    query(query){
        console.log('Executing query...');
        return this.knex.raw(query);
    }

    listTables(){
        console.log('Listing tables...');
        if(this.connection.type === 'pg')
            return this.knex.raw('SELECT tablename FROM pg_tables WHERE schemaname=\'public\'').then(results => results.rows);
        else if(this.connection.type == 'mysql')
            return this.knex.raw('SELECT * FROM information_schema.tables').then(results => results.rows);
    }

};

module.exports = Client;