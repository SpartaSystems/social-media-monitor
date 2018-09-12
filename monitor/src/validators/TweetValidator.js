"use strict";
class TweetValidator {
    static meetsExpectations(tweet) {
        if (tweet && tweet.id) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = TweetValidator;
