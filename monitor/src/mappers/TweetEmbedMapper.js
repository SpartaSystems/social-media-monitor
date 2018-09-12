"use strict";

let https = require('https');

class TweetEmbedMapper {
    constructor() {
    }
    map(id, spartatized, resolve, reject) {
      let url = 'https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/' + id;
      console.log('url: ' + url);
      https.get(url, (resp) => {
          let data = ''
          resp.on('data', (chunk) => {
              data += chunk;
          });
          resp.on('end', () => {
              try {
                  spartatized.embed = JSON.parse(data);
                  resolve(spartatized);
              } catch(x) {
                  reject(x)
              }
          });

      }).on("error", (err) => {
          reject(err);
      });
    }
}
module.exports = TweetEmbedMapper;
