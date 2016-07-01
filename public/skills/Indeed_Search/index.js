"use strict"

const alexa = require('alexa-app');
const app = new alexa.app('pokedex');
const indeedler = require('./services/indeed.service');

module.change_cose = 1;

app.launch((req, res) => {
    const prompt = 'Welcome to Indeedly.';
    const reprompt = 'You can ask me what you\'re looking for in the job and where';

    res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('job', {
    'slots': {'criteria': 'LITERAL'}
    ,'utterances': ['Let\'s look for jobs with {criteria}']
}, (req, res) => {
    let criteria = req.slot('criteria');

    if(criteria) {

    }
});