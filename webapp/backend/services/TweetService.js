"use strict";

class TweetService {

    static tweets(client, filter, callback) {
        if (!filter) filter = {};
        if (!filter.lang) filter.lang = ['en'];
        if (!filter.phrases) filter.phrases = [];
        if (!filter.sentiment) filter.sentiment = [];
        if (!filter.entities) filter.entities = [];
        if (!filter.entityTypes) filter.entityTypes = [];

        let query = {'$or':[]};
        if (filter.lang.length > 0 && filter.lang[0]!='*')
            query['lang']={'$in':filter.lang};

        if (filter.sentiment.length > 0 && filter.sentiment[0] != '*')
            query['sentiment.Sentiment']={'$in':filter.sentiment };

        if (filter.phrases.length > 0 && filter.phrases[0] != '*')
            query.$or.push({'phrases.KeyPhrases.Text':{
              '$in':filter.phrases.map((phrase)=>{return new RegExp(phrase, 'i')}) }
            });

        if (filter.entities.length > 0 && filter.entities[0] != '*')
            query.$or.push({'entities.Entities.Text':{
              '$in':filter.entities.map((entity)=>{ return new RegExp(entity, 'i') }) }
            });

        if(filter.entityTypes.length > 0 && filter.entityTypes[0] != '*')
            query['entities.Entities.Type']={'$in':filter.entityTypes };

        if (query.$or.length > 0 || filter.sentiment.length > 0 || filter.entityTypes.length > 0) {
            if (query.$or.length === 0) delete query.$or;
            client.connect( (err, client) => {
                client.db('smm').collection('tweets').find(query)
                .project({'text':1,'tweet_id':1,'sentiment':1, 'entities':1, 'phrases':1, 'embed':1})
                .toArray((err,docs)=>{
                    if(err) throw err;
                    client.close();
                    callback(docs);
                });
            });
        } else {
            callback([])
        }
    }
}
module.exports = TweetService;
