"use strict";
class FilterService {
    constructor() {
    }
    match(tweet, filters) {
        let matches = [],
            trackedMatches = this.matchTrack(tweet, filters);
        if (trackedMatches.length > 0) {
            for(let m = 0; m <= trackedMatches.length-1; m++) {
                let match = trackedMatches[m];
                console.log('watcher :: investigating possible match: ', match)
                if (match && match.type === 'positive-sentiment' ||
                    match.type === 'negative-sentiment' ||
                    match.type === 'mixed-sentiment' ||
                    match.type === 'neutral-sentiment') {
                    if (this.matchSentiment(tweet, match))
                        matches.push(match);
                } else if (match.type === 'keywords') {
                    matches.push(match);
                }
            }
        }
        return matches;
    }
    matchTrack(tweet, filters) {
        let matches = [];
        for(let i = 0; i <= filters.length; i++) {
            let filter = filters[i];
            if (filter && filter.keywords) {
               for(let j = 0; j <= filter.keywords.length-1; j++) {
                   let keyword = filter.keywords[j];
                   if (tweet.text && keyword) {
                       if (tweet.text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                           matches.push(filter);
                       }
                   }
                }
            }
        }
        return matches;
    }
    matchSentiment(tweet, match) {
        let matches = false;

        if (match && match.type === 'positive-sentiment' &&
        tweet.sentiment.Sentiment === 'POSITIVE')
            matches = true;

        if (match && match.type === 'negative-sentiment' &&
        tweet.sentiment.Sentiment === 'NEGATIVE')
            matches = true;

        if (match && match.type === 'mixed-sentiment' &&
        tweet.sentiment.Sentiment === 'MIXED')
            matches = true;

        if (match && match.type === 'neutral-sentiment' &&
        tweet.sentiment.Sentiment === 'NEUTRAL')
            matches = true;

        return matches;
    }
}
module.exports = FilterService;
