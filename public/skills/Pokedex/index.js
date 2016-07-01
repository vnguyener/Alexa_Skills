var alexa = require('alexa-app');
var app = new alexa.app('pokedex');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

app.launch(function(req, res) {
   var prompt = 'Welcome to the Alexa, Pokedex. How can I help?';
   var reprompt = 'Really, ask me anything about pokemon..';
 //res.session('number', number);
   res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('id', {
        'slots': {'POKEID': 'NUMBER'}
        ,'utterances': ['{GUESSNUM}']
    },
    function(req, res) {
        
    }
); 

module.exports = app;