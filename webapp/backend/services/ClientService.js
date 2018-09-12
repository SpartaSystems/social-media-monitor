"use strict";
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;

class ClientService{
    constructor(options){
        if(!options.name){
            throw('You must provide a name and collection.');
        }

        const protocol = options.protocol || '';
        const host = options.host || localhost;
        const port = options.port || '';
        this.name = options.name;
        this.options = options;

        if(protocol==='mongodb') {
            if(port==='') port='27017';
            this._client = new MongoClient(new Server(host, port), {native_parser: true, auto_reconnect: true});
        }
    }

    set client(client){
        this._client = client;
    }

    get client(){
        return this._client;
    }
}
module.exports = ClientService;