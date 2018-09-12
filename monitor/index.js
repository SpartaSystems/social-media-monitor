"use strict";

let AWS = require('aws-sdk');
let ConfigurationService = require('./src/services/ConfigurationService.js');
let NotificationService = require('./src/services/NotificationService.js');
let FilterService = require('./src/services/FilterService.js');
let TweetModel = require('./src/models/TweetModel.js');
let TweetRemarkMapper = require('./src/mappers/TweetRemarkMapper.js');
let ComprehendRemarkMapper = require('./src/mappers/ComprehendRemarkMapper.js');
let TweetEmbedMapper = require('./src/mappers/TweetEmbedMapper.js');
let NotificationMapper = require('./src/mappers/NotificationMapper.js');
let TweetValidator = require('./src/validators/TweetValidator.js');
let TwitterStream = require('twitter-stream-api');
let DbConfig = require('./configuration/db.js');
let TwitterConfig = require('./configuration/twitter.js');
let ApplicationConfig = require('./configuration/app.js');
let configurator = new ConfigurationService(ApplicationConfig);

AWS.config.loadFromPath('./configuration/aws.json');

configurator.readFilters(() => {

    let comprehender = new ComprehendRemarkMapper(AWS);
    let speaker = new NotificationMapper();
    let embedder = new TweetEmbedMapper();
    let microphone = new NotificationService(ApplicationConfig.smtp);
    let filteration = new FilterService();
    let twitter = new TwitterStream(TwitterConfig.Authentication, false);
    let model = new TweetModel(DbConfig);
    let keywords = configurator.keywords;

    console.log('watcher :: tracking keywords: ', JSON.stringify(keywords, null, 2));

    if (keywords.length > 0) {

      /*
      twitter.debug(function (reqObj) {
         require('request-debug')(reqObj, function (type, data, req) {
             console.log(type, data, req);
         });
      });
      */

      twitter.on('connection success', function (uri) {
          console.log('connection success', uri);
      });

      twitter.on('connection aborted', function () {
          console.log('connection aborted');
      });

      twitter.on('connection error network', function (error) {
          console.log('connection error network', error);
      });

      twitter.on('connection error stall', function () {
          console.log('connection error stall');
      });

      twitter.on('connection rate limit', function (httpStatusCode) {
          console.log('connection rate limit', httpStatusCode);
      });

      twitter.on('connection error unknown', function (error) {
          console.log('connection error unknown', error);
          twitter.close();
      });

      twitter.stream('statuses/filter', {
          track: keywords
      });

      twitter.on('data', (rawBuffer) => {

          let tweet;
          try {
              tweet = JSON.parse( rawBuffer.toString() );
          } catch(x) {
              console.log('watcher :: tweet parsing failed: ', x)
          }

          if (tweet.retweeted_status)
              tweet = tweet.retweeted_status;

          tweet.lang = 'en';

          if (TweetValidator.meetsExpectations(tweet)) {

              let remark = TweetRemarkMapper.remarkitize(tweet),
              spartatized = TweetRemarkMapper.spartatize(tweet);

              Promise.all([

                  new Promise( (resolve, reject) => {
                      comprehender.mapEntities(remark, spartatized, resolve, reject);
                  }),

                  new Promise( (resolve, reject) => {
                      comprehender.mapKeyPhrases(remark, spartatized, resolve, reject);
                  }),

                  new Promise( (resolve, reject) => {
                      comprehender.mapSentiment(remark, spartatized, resolve, reject);
                  }),

                  new Promise( (resolve, reject) => {
                       embedder.map(tweet.id_str, spartatized, resolve, reject)
                  })

              ]).then(() => {

                  let matches = filteration.match(spartatized,
                      ApplicationConfig.filters);

                  console.log('watcher :: matched: ', matches);

                  matches.forEach( (match, mIndex, mArray) => {
                      match.to.forEach( (to, index, array) => {
                          spartatized.firstName = to.firstName;
                          spartatized.lastName = to.lastName;
                          spartatized.match = match;
                          spartatized.tweetJson = JSON.stringify(spartatized, null, 2)
                          microphone.send(
                              'noreply@spartasystems.com',
                              to.address,
                              'SomeApp Notification (' + match.type + ')',
                              speaker.map({
                                  template: match.type,
                                  variables: spartatized
                              })
                          );
                      });
                  });

                  model.save(spartatized,(result, ops) => {
                      console.log('watcher :: saved tweet model: ', spartatized);
                  });
              });
          } else {
              console.log('watcher :: tweet validation failure: ', tweet);
          }
      });
    }
}, (err) => {
    console.log('watcher :: filters config failure: ', err)
});
