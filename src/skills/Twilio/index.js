"use strict"

const alexa = require('alexa-app');
const app = new alexa.app('heytwilio');
const twilio = require('./services/twilio.service');


module.change_code = 1;

app.launch((req, res) => {
    const prompt = "Hey, welcome to Hey Twilio! Who do you wanna shoot a text to?";
    const reprompt = "Still there?";

    res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('text', {
    'slots': { 'message': 'LITERAL' },
    'utterances': ['say {message}', 'send {message}']
}, (req, res) => {

    let message = req.slot('message');
    let options = {
        account_sid: '',
        auth_token: '',
        from: ''
    }

    let handler = function (err, res) {
        if (err) {
            console.log(err);
        }
    }

    if (message) {
        //res.say('Got it, who you do you want me to send it to?');
        // grab name from session
        try {
            res.say('Got it. Sending now.');
            twilio.sendTextMessage(options, '', message, handler);
            res.shouldEndSession(true);
        } catch (err) {
            res.say('There was an error with the service call saying');
            res.say(err.mesage);
            res.say('Let me try again.');
            res.shouldEndSession(false);
        }

    } else {
        res.say('Sorry, I didn\'t get that. Could you tell me again?');
        res.shouldEndSession(false);
    }

});

module.exports = app;