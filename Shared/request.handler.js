function requestHandler() {

  const requestTypes = ['LaunchRequest', 'IntentRequest', 'SessionEndedRequest'];

  function onSessionStarted(event) {
    let requestId = event.request.requestId;
    let eventSession = event.session;

    console.log('onSessionStarted requestId = ' + requestId
      + ', sessionId=' + eventSession.sessionId);
  }

  function onLaunchRequest(event) {

  }

  function onIntentRequest(event) {

  }

  function onSessionEnd(event) {

  }

  return {
    onSessionStarted: onSessionStarted,
    onLaunchRequest: onLaunchRequest,
    onIntentRequest: onIntentRequest,
    onSessionEnd: onSessionEnd,
  };

  function getEventRequestType() {
    let index = requestTypes.indexOf(event.request.type);
    return requestTypes[index];
  }
}

module.exports = requestHandler;
