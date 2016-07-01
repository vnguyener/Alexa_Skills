"use strict"

const alexa = require('alexa-app');
const app = new alexa.app('pokedex');
const pokedex = require('./services/pokedex.service');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

app.launch((req, res) => {
    const prompt = 'Welcome to the Alexa, Pokedex. How can I help?';
    const reprompt = 'Really, ask me anything about pokemon..';
    res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('id', {
    'slots': { 'POKEID': 'NUMBER' }
    , 'utterances': ['What can you find out about Pokemon Number {POKEID}?']
}, (req, res) => {

    let pokeId = req.slot('POKEID');
    let pokemon = {};
    let str = ''
    if (pokeId) {
        console.log('requested pokeid: ' + pokeId);
        res.say('Searching for Pokemon Number...' + pokeId + ' give me a sec ');
        pokedex.getPokemonById(pokeId)
            .on('data', (res) => {
                str += res;
            })
            .on('end', () => {
                pokemon = JSON.parse(str);
                res.say('Here\'s what I can find about' + pokemon.name);
                console.log(pokemon.name);
            });
    }
});

module.exports = app;