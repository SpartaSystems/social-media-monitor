"use strict";
class TweetRemarkMapper {
	static remarkitize(tweet) {

				if (tweet.lang === 'und') tweet.lang = 'en';

        let text = tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text;

				return  {
            LanguageCode: tweet.lang, /* required - other option is es */
            Text: text
        };
	}
	static spartatize(tweet) {
        return {
            tweet_id: tweet.id_str,
            text: tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text,
            lang: tweet.lang,
            place: tweet.place,
            coordinates: tweet.coordinates,
            twitter_entities: tweet.entities,
            twitter_user: tweet.user
        };
	}
}
module.exports = TweetRemarkMapper;
