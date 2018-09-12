"use strict";

class PhraseService{

    static phrases(client, options, callback){
        client.connect(function(err, client) {
            const db = client.db('smm');
            let filter = [{'count':{$gte:options.mincount}}];
            if(options.term !== '*' && options.term.length>0){
                let re = new RegExp('^'+options.term+'|[\\s#@]+'+options.term,'i');
                filter.push({'_id':{$regex:re}});
            }
            if (options.lang.length > 0 && options.lang[0]!='*')
                filter['lang']={'$in':options.lang};

            db.collection('tweets')
                .aggregate([
                    {$unwind:'$phrases.KeyPhrases'},
                    {$group:{_id:{$toLower:'$phrases.KeyPhrases.Text'},count:{$sum:1}}},
                    {$match:{$and:filter}}
                ])
            .toArray((err,docs)=>{
                if(err) throw err;
                client.close();
                let response = docs
                    .filter(d=>d._id.match(/^[a-z0-9]+/))
                    .map((d)=>{return {text:d._id,count:d.count}})
                    .sort((a,b)=>{
                        if (a.last_nom < b.last_nom)
                            return -1;
                        if (a.last_nom > b.last_nom)
                            return 1;
                        return 0;
                     });
                callback(response);
            });
        });
    }
}
module.exports = PhraseService;