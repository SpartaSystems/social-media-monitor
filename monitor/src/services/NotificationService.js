"use strict";
class NotificationService {
    constructor(options) {
        if (!options) options = {};
        this.nodeMailer = require('nodemailer');
        this.nodeMailerSMTPTransporter = require('nodemailer-smtp-transport');
        this.nodeMailerConfig = {
            debug: true,
            logger: true,
            host: options.host || 'localhost',
            port: options.port || 25,
            secure: options.secure || false
        }
        if (options.user && options.pass) {
            this.nodeMailerConfig.auth = {
                user: options.user,
                pass: options.pass
            };
        }
    }
    send(from, to, subject, body, cb) {
        let transporter = this.nodeMailer.createTransport(
            this.nodeMailerSMTPTransporter(this.nodeMailerConfig));
        transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: body,
            attachments: [{
              cid: 'app-logo',
              filename: 'app-logo.png',
              path: './media/app-logo.png'
            }, {
              cid: 'notification-styles',
              filename: 'notification-styles.css',
              path: './media/notification-styles.css'
          }]
        }, cb);
        return transporter;
    }
}
module.exports = NotificationService;
