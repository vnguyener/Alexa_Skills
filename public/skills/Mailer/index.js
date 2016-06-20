var alexa = require('alexa-app');
var app = new alexa.app('mailer');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    ignoreTLS: true,
    auth: {
        user: 'its.vnguyen@gmail.com', // my mail
        pass: 'SWichita0130!!@'
    }
}));

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

app.launch(function(req, res) {
   var launchPrompt = 'Who would you like to send mail to today?';
   res.say(launchPrompt).reprompt(launchPrompt).shouldEndSession(false);
});

app.intent('BODY', {
        'slots': {'MAILBODY': 'LITERAL'}
        ,'utterances': ['{MAILBODY}']
    },
    function(req, res) {
        var body = req.slot('MAILBODY');

        var mailOptions = {
            from: 'Vu From <its.vnguyen@gmail.com>', 
            to: 'Vu To <its.vnguyen@gmail.com>', 
            subject: 'Alexa - Vu Nguyen', 
            text: body
        };

        console.log(mailOptions);

        transport.sendMail(mailOptions, function(error, info){
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