const shortid = require('shortid');

class Query{
    constructor() {
        this.id = shortid.generate();
        this.text = '';
        this.results = [];
        this.columns = [];
    }

}

module.exports = Query;