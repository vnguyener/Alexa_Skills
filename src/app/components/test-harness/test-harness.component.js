function clone(o) {
    return JSON.parse(JSON.stringify(o));
}

angular.module('alexa', []).controller('AlexaController', function ($scope, $http) {
    $scope.schema = <%-schema %>;
    $scope.request = {};
    $scope.response = null;
    $scope.requestType = null;
    $scope.session = {};
    $scope.intent = null;

    $scope.changetype = function () {
        $scope.request = clone($scope.templates[$scope.requestType]);
        $scope.request.session.attributes = $scope.session;
        $scope.intent = null;
    };

    $scope.changeintent = function () {
        $scope.request = clone($scope.templates['intent']);
        $scope.request.session.attributes = $scope.session;
        $scope.request.request.intent.slots = {};
        $scope.request.request.intent.name = $scope.intent;
    }

    $scope.post = function () {
        try {
            $http.post(location.href, $scope.request).success(function (data) {
                $scope.response = data;
                // Copy session variables
                if ($scope.response && $scope.response.sessionAttributes) {
                    $scope.session = $scope.response.sessionAttributes;
                    $scope.request.session.attributes = $scope.session;
                }
            });
        } catch (e) { alert(e.message); }
    }

    $scope.getIntent = function () {
        try {
            var intents = $scope.schema.intents;
            for (var i = 0; i < intents.length; i++) {
                var intent = intents[i];
                if (intent.intent == $scope.request.request.intent.name) {
                    return intent;
                }
            };
            return null;
        } catch (e) { return null; }
    };

    $scope.templates = {
        // LaunchRequest template
        "launch": {
            "version": "1.0",
            "session": {
                "new": true,
                "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
                "application": {
                    "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
                },
                "attributes": {},
                "user": {
                    "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
                }
            },
            "request": {
                "type": "LaunchRequest",
                "requestId": "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423",
                "timestamp": "2015-05-13T12:34:56Z"
            }
        }
        // IntentRequest template
        , "intent": {
            "version": "1.0",
            "session": {
                "new": false,
                "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
                "application": {
                    "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
                },
                "attributes": {},
                "user": {
                    "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
                }
            },
            "request": {
                "type": "IntentRequest",
                "requestId": "amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d",
                "timestamp": "2015-05-13T12:34:56Z",
                "intent": {
                    "name": "",
                    "slots": {}
                }
            }
        }
        // SessionEndedRequest template
        , "session_end": {
            "version": "1.0",
            "session": {
                "new": false,
                "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
                "application": {
                    "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
                },
                "attributes": {},
                "user": {
                    "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
                }
            },
            "request": {
                "type": "SessionEndedRequest",
                "requestId": "amzn1.echo-api.request.d8c37cd6-0e1c-458e-8877-5bb4160bf1e1",
                "timestamp": "2015-05-13T12:34:56Z",
                "reason": "USER_INITIATED"
            }
        }
    };
    // Extract the applicationId if it exists and update the templates
    var applicationId = "<%= app.id || "" %>";
    if (applicationId) {
        $scope.templates.launch.session.application.applicationId = applicationId;
        $scope.templates.intent.session.application.applicationId = applicationId;
        $scope.templates.session_end.session.application.applicationId = applicationId;
    }
});