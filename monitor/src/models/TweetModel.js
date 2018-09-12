"use strict";
let MongoClient = require('mongodb').MongoClient;
let Server = require('mongodb').Server;

class TweetModel{
    constructor(options){
        if(!options.name){
            throw('You must provide a name and collection.');
        }

        let protocol = options.protocol || '';
        let host = options.host || localhost;
        let port = options.port || '';
        this.name = options.name;
        this.options = options;

        if(protocol==='mongodb') {
            if(port==='') port='27017';
            this.collection='tweets';
            this.dbClient = new MongoClient(new Server(host, port), {native_parser: true, auto_reconnect: true});
        }
    }

    save(tweet, callback){
        let that=this;
        that.dbClient.connect(function(err, client) {
            let db = client.db(that.name);
            db.collection(that.collection).insertOne(tweet, (err, res)=>{
                if (err) throw err;
                callback(res);
                client.close();
            })
        });
    }

}
module.exports = TweetModel;