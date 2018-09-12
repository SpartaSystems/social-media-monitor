"use strict";

class EntityService{

    static entityTypes(client, callback){
        client.connect(function(err, client) {
            const db = client.db('smm');
            db.collection('tweets')
                .distinct('entities.Entities.Type',{},(err,docs)=>{
                if(err) throw err;
                client.close();
                callback(docs.sort());
            });
        });
    }

    static entityValues(client, key, callback){
        client.connect(function(err, client) {
            const db = client.db('smm');
            db.collection('tweets')
                .find({'lang':'en','entities.Entities.Type':key})
                .project({'entities.Entities':1,'_id':0})
                .toArray((err,docs)=>{
                if(err) throw err;
                client.close();

                let values = docs
                    .reduce((a,c)=>{return a.concat(c.entities.Entities)},[])
                    .filter((e)=>{return e.Type===key && e.Score>=0.8 && !e.Text.startsWith('@') && !e.Text.startsWith('#')})
                    .map((e)=>{return e.Text.toLowerCase()}).sort();
                let response = Array.from(new Set(values));
                callback(response);
            });
        });
    }

    static entities(client, options, callback){
        client.connect(function(err, client) {
            const db = client.db('smm');
            let filter = [{count:{$gte:options.mincount}}];
            
            if (options.lang.length > 0 && options.lang[0]!='*')
                filter['lang']={'$in':options.lang};

            if(options.term !== '*' && options.term.length>0){
                let re = new RegExp('^'+options.term+'|[\\s#@]+'+options.term,'i');
                filter.push({'_id.text':{$regex:re}});
            }
            if(options.types.length > 0 && options.types[0] != '*'){
                filter.push({'_id.type':{'$in':options.types}});
            }
            db.collection('tweets')
                .aggregate([
                    {$unwind: '$entities.Entities'},
                    {$group:{_id:{type:'$entities.Entities.Type',text:{$toLower:'$entities.Entities.Text'}},count:{$sum:1}}},
                    {$match: {$and:filter}},
                    {$group:{'_id':'$_id.type',values:{$push:{"text":"$_id.text","count":"$count"}}}}
                    ])
                .toArray((err,docs)=>{
                if(err) throw err;
                client.close();
                callback(docs);
            });
        });
    }
}
module.exports = EntityService;