"use strict";
class ComprehendRemarkMapper {
    constructor(AWS) {
        this.Comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'});
    }
    mapEntities(remark, spartatized, resolve, reject) {
        this.Comprehend.detectEntities(remark, (err, data) => {
            if (err) {
                console.error('mapEntities failed: ', err);
                reject(err);
            } else {
                spartatized.entities = data;
                resolve(data);
            }
        });
    }
    mapKeyPhrases(remark, spartatized, resolve, reject) {
        this.Comprehend.detectKeyPhrases(remark, (err, data) => {
            if (err) {
                console.error('mapKeyPhrases failed: ', err);
                reject(err);
            } else {
                spartatized.phrases = data;
                resolve(data);
            }
        });
    }
    mapSentiment(remark, spartatized, resolve, reject) {
        this.Comprehend.detectSentiment(remark, (err, data) => {
            if (err) {
                console.error('mapSentiment failed: ', err);
                reject(err);
            } else {
                spartatized.sentiment = data;
                resolve(data);
            }
        })
    }
}
module.exports = ComprehendRemarkMapper;
