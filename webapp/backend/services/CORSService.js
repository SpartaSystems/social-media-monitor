"use strict";

class CORSService {
    static handler(request, response, next) {
        response.header('Access-Control-Allow-Origin',
            '*');
        response.header('Access-Control-Allow-Methods',
            'GET,PUT,POST,DELETE,OPTIONS');
        response.header('Access-Control-Allow-Headers',
            'Content-Type, Authorization, Content-Length, X-Requested-With, token');
        if ('OPTIONS' === request.method) {
            response.sendStatus(200);
        } else {
            next();
        }
    }
}
module.exports = CORSService;
