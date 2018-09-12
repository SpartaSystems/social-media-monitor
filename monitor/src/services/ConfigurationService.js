"use strict";
class ConfigurationService {
    constructor(config) {
        this.config = config;
        if (!this.config) this.config = {};
        if (!this.config.filters) this.config.filters = [];
    }
    readFilters(done, fail) {
        let readfiles = require('node-readfiles');
        readfiles('./configuration/notification-filters', (err, filename, contents) => {
            if (err) fail(err);
            if (contents) {
                try {
                    this.config.filters.push(JSON.parse(contents));
                } catch(x) {
                  fail(x)
                }
            }
        }).then(function (files) {
            done(files);
        }).catch(function (err) {
            fail(err);
        });
    }
    
    get keywords() {
        let keywords = [];
        try {
            keywords = Array.from( new Set (
                this.config.filters.map(filter=>filter.keywords)
                    .reduce((acc, cur)=>{return acc.concat(cur)})
            ));
        } catch(x) {
        }
        return keywords;
    }
}
module.exports = ConfigurationService;
