import mongojs from 'mongojs'
import config from 'config'

'use strict';

class Mongo {

    constructor() {
        this.username = config.get('mongo.username');
        this.password = config.get('mongo.password');
        this.server = config.get('mongo.server');
        this.port = config.get('mongo.port');
        this.database = config.get('mongo.database');
        this.auth = this.username ? this.username + ':' + this.password + '@' : '';
    }

    connection(){
        return 'mongodb://' + this.server + ':' + this.port + '/' + this.database;
    }

    getConnection(){
        const db = mongojs(this.connection());
        db.on('error', function (err) {
            console.log(err);
        });
        return db;
    }
}

export default Mongo;