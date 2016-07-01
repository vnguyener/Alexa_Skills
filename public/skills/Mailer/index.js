var alexa = require('alexa-app');
var app = new alexa.app('mailer');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtp://emailrelay.corpint.net');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

app.launch(function(req, res) {
   var launchPrompt = 'let\'s send some phoney mail!';
   //res.session('number', number);
   res.say(launchPrompt).reprompt(launchPrompt).shouldEndSession(false);
});

app.intent('BODY', {
        'slots': {'MAILBODY': 'LITERAL'}
        ,'utterances': ['{MAILBODY}']
    },
    function(req, res) {
        var body = req.slot('MAILBODY');

        var mailOptions = {
            from: 'Vu From <vtnguyen@santanderconsumerusa.com>', 
            to: 'Vu To <vtnguyen@santanderconsumerusa.com>', 
            subject: 'Hi', 
            text: body
        };

        console.log(mailOptions);

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                res.reprompt('Sorry, there was an error trying to send an email. Try again.');
                console.log(error);
                res.shouldEndSession(false);

            }
            res.say('Your email has been sent');
            res.shouldEndSession(true);
        });  
    }
); 


module.exports = app;