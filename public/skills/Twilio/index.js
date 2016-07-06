"use strict"

const alexa = require('alexa-app');
const app = new alexa.app('hey-twilio');
const twilio = require('twilio')('AC316319c0039bfb33608b7296eb07b9f2', '1e84e0acdae2699f5ae02bbc97bc8a62');

module.change_code = 1;

app.launch((req, res) => {
   const prompt = "";
   const reprompt = "";
   
    res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('text', {
    'slots': {'message': 'LITERAL'},
    'utterances': ['{message}']
}, (req, res) => {
    let message = req.slot('message');
    
});