function request() {

  const requestTypes = ['LaunchRequest', 'IntentRequest', 'SessionEndedRequest'];

  function branch(event, onLaunchRequest, onIntentRequest, endRequest) {
    let intentType = checkEventRequestType(event);
    
    if (intentType.isLaunchRequest) onLaunchRequest(event)
    else if (intentType.isIntentRequest) onIntentRequest(event)
    else if(intentType.isEndRequest) onSessionEnd(event)
    
  }
  
  function start(event) {
    let requestId = event.request.requestId;
    let eventSession = event.session;

    console.log('onSessionStarted requestId = ' + requestId
      + ', sessionId=' + eventSession.sessionId);
  }
  
  return {
    branch: branch,
    start: start
  };

  function checkEventRequestType(event) {
    let requestType = {
        isLaunchRequest: false,
        isIntentRequest: false,
        isEndRequest: false
    }
    
    let index = requestTypes.indexOf(event.request.type);
    
    if(index > -1) {
        requestType.isLaunchRequest = (index === 0 ? true : false);
        requestType.isIntentRequest = (index === 1 ? true : false);
        requestType.isEndRequest = (index === 2 ? true : false);
    };
  }

  function onLaunchRequest(event) {

  }

  function onIntentRequest(event) {

  }

  function onSessionEnd(event) {
          console.log('Alexa session has ended w/ requestId= ' + event.request.requestId
        + ', sessionId=' + event.session.sessionId);
  }
}

module.exports = request;
