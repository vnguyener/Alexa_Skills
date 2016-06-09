let https = require('https');
let options = {
  host: 'hooks.slack.com',
    path: '/services/:id',
    method: 'POST'
};
let channelSlot = '';

exports.handler = (event, context) => {
    try {
        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);

            context.succeed();
        }
    } catch (e) {
        context.fail('Exception: ' + e);
    }
};

function onSessionStarted(sessionStartedRequest, session) {
    console.log('onSessionStarted requestId=' + sessionStartedRequest.requestId
        + ', sessionId=' + session.sessionId);
}

function onLaunch(launchRequest, session, callback) {
    console.log('onLaunch requestId=' + launchRequest.requestId
        + ', sessionId=' + session.sessionId);

    getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log('onIntent requestId=' + intentRequest.requestId
        + ', sessionId=' + session.sessionId);

    let intent = intentRequest.intent;
    let intentName = intentRequest.intent.name;

    if ('MyMessageIntent' === intentName) {
        console.log('MyMessageIntent');
        setMessageInSession(intent, session, callback);
    } else if ('MyChannelIntent' === intentName) {
        console.log('MyChannelIntent');
        setChannelInSession(intent, session, callback);
    } else {
        console.log('Unknown intent');
        throw 'Invalid intent';
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log('onSessionEnded requestId=' + sessionEndedRequest.requestId
        + ', sessionId=' + session.sessionId);
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output
        },
        card: {
            type: 'Simple',
            title: 'SessionSpeechlet - ' + title,
            content: 'SessionSpeechlet - ' + output
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    let sessionAttributes = {};
    let cardTitle = 'Welcome';
    let speechOutput = 'Welcome to the Alexa and Lambda Slack demo app, '
        + 'You can give me a message to send to our team\'s Slack channel by saying, '
        + 'my target is blank and then say to send blank...';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    let repromptText = 'You can give me your message by saying, '
        + 'my message is...';
    let shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function setChannelInSession(intent, session, callback) {
    let cardTitle = intent.name;
    channelSlot = intent.slots.Channel.value !== undefined ? intent.slots.Channel.value : '';
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (channelSlot !== '') {
        sessionAttributes = createChannelAttributes(channelSlot);
        speechOutput = 'Your message is going on channel ' + channelSlot + '. What do you want to say?';
        repromptText = 'I didn\'t hear you message clearly, can you give me your message to ' + channelSlot + '?';
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    } else {
        speechOutput = 'You didn\'t set a channel.';
        repromptText = 'I didn\'t hear your channel clearly, you can give me your '
            + 'message by saying, Tell Slack to target...';
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function setMessageInSession(intent, session, callback) {
    let cardTitle = intent.name;
    let messageSlot = intent.slots.OutGoingMessage;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if (session.attributes) {
        channelSlot = session.attributes.channel;
        console.log(session.attributes.channel);
    }

    if (channelSlot !== '' && messageSlot) {

        message = messageSlot.value;
        console.log('Message slot contains: ' + message + '.');
        sessionAttributes = createMessageAttributes(message);
        speechOutput = 'Your message has been sent saying ' + message + 'on channel ' + channelSlot;
        repromptText = '';
        let req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });
        });
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            context.fail(e);
        });
        req.write("{'channel': '@vnguyener', 'username': 'alexa-bot', 'text': '[via Alexa]: " + message + ", 'icon_emoji': ':ghost:'}");
        req.end();
    } else {
        if (channelSlot === '') {
            speechOutput = 'You didn\'t set a channel.';
            repromptText = 'I didn\'t hear your channel clearly, you can give me your '
                + 'message by saying, Tell Slack to target...';
        }
        else {
            speechOutput = 'I didn\'t hear your message clearly, please try again';
            repromptText = 'I didn\'t hear your message clearly, you can give me your '
                + 'message by saying, Tell Slack to send...';

        }
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function createChannelAttributes(channel) {
    return {
        channel: channel
    };
}

function createMessageAttributes(message) {
    return {
        message: message
    };
}

function getMessageFromSession(intent, session, callback) {
    let cardTitle = intent.name;
    let message;
    let repromptText = null;
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (session.attributes) {
        message = session.attributes.message;
    }

    if (message) {
        speechOutput = 'Your message is ' + message + ', goodbye';
        shouldEndSession = true;
    }
    else {
        speechOutput = 'I didn\'t hear your message clearly. As an example, you can say, My message is hello, team!';
    }

    callback(sessionAttributes,
        buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}