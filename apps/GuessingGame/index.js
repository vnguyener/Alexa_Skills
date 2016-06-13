let alexa = require('alexa-app');
let app = new alexa.app('guessinggame');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

app.launch(function(req, res) {
   let number = Math.floor(Math.random() * 99) + 1;
   let prompt = 'Guess a number between 1 and 100!';
   res.session('number', number);
   res.session('guesses', 0);
   res.say(prompt).reprompt(prompt).shouldEndSession(false);
});

app.intent('guess', {
        'slots': {'guess':'NUMBER'}
        ,'utterances': ['{1-100}|guess']
    },
    function(req,res) {
        let guesses = (+req.session('guesses'))+1;
        let guess = req.slot('guess');
        let number = +req.session('number');
        if (!guess) {
            res.say('Sorry, I didn\'t hear a number. The number was' + number);
        }
        else if (guess === number) {
            res.say('Congratulations, you guessed the number in ' + guesses + (guesses === 1 ? ' try ' : 'tries'));
        }
        else {
            if (guess > number) {
				res.say('Guess lower');
			}
			else if (guess < number) {
				res.say('Guess higher');
			}
			res.reprompt('Sorry, I didn\'t hear a number. Try again.');
			res.session('guesses', guesses);
			res.shouldEndSession(false);
        }
    }
) 


module.exports = app;