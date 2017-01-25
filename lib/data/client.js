const _ = require('underscore'),
      knex = require('knex'),
      Promise = require('bluebird'),
      config = new (require('electron-config'))();

class Client{
    constructor(connectionJson){
        this.connection = connectionJson;
        this.init();
    }

    init(){
        if(this.connection.isUri){
            this.knex = knex({ client: this.connection.type, connection: this.connection.uri });
        }
        else {
            this.knex = knex({ client: this.connection.type, connection: this.connection });
        }
    }


    query(query){
        console.log(`[Client][${this.connection.name}] Executing Query: ${query}`);
        return this.knex.raw(query)
            .then(data => {
                if(this.connection.type == 'mysql'){
                    console.log(data[0]);
                }
                return data;
            });
    }

    listTables(){
        console.log(`[Client][${this.connection.name}] Listing tables`);

        let loadTables = () => {
            if(this.connection.type === 'pg')
                return this.knex.raw('SELECT tablename, schemaname FROM pg_tables WHERE schemaname NOT IN (\'pg_catalog\', \'information_schema\')');
            else if(this.connection.type == 'mysql')
                return this.knex.raw('SELECT * FROM information_schema.tables');
            else 
                return Promise.reject('Unsupported database type.');
        };

        return loadTables()
            .tap(results => console.log(`[Client][${this.connection.name}] Found tables:`, results))
            .then(results => results.rows);
    }

};

module.exports = Client;