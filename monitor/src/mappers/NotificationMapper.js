"use strict";
class NotificationMapper {
    constructor() {
        this.fs = require('fs');
        this.ejs = require('ejs');
    }
    template(name) {
        let file, contents;
        switch(name) {
            case 'keywords':
              file = 'src/templates/notifications/keywords.html';
            break;
            case 'positive-sentiment':
                file = 'src/templates/notifications/sentiment-positive.html';
            break;
            case 'mixed-sentiment':
                file = 'src/templates/notifications/sentiment-mixed.html';
            break;
            case 'negative-sentiment':
                file = 'src/templates/notifications/sentiment-negative.html';
            break;
            case 'neutral-sentiment':
                file = 'src/templates/notifications/sentiment-neutral.html';
            break;
            default:
                file = null;
        }
        if (file) {
            contents = this.fs.readFileSync(file, 'utf8');
        }
        return contents;
    }
    map(options) {
        return this.ejs.render(this.template(options.template),
            options.variables);
    }
};
module.exports = NotificationMapper;
