"use strict"

const twilio = require('twilio');



let TwilioService = function() {
    let initialize = function(options) {
        options = options || {};

        try {
            return new twilio.RestClient(options.account_sid, options.auth_token);
        } catch(err) {
            console.log(err);
        }
    }

    let sendTextMessage = function(options, to, body, callback) {
        let client = initialize(options);

        client.sendMessage({
            to: to || '',
            from: options.from || '',
            body: body || 'ahoy'
        }, (err, res) => {
            if (!err) {
                console.log('Message send from: ' + res.from);
                callback(null, res);
            } else {
                callback(err, res);
            }
        });
    };

    return {
        sendTextMessage: sendTextMessage,
    }
};

module.exports = TwilioService();