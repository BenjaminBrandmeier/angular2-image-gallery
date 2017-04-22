var BrowserStack = require("browserstack");
var process = require("process");
var argv = require('minimist')(process.argv.slice(2));

var browserStackCredentials = {
  username: process.env.BROWSERSTACK_USERNAME,
  password: process.env.BROWSERSTACK_KEY
};

var automateClient = BrowserStack.createAutomateClient(browserStackCredentials);

automateClient.getBuilds(function (error, builds) {
  console.log("The following builds are available for automated testing");
  console.log(builds);

  var lastBuildId = builds[0].hashed_id;
  console.log('lastBuildId', lastBuildId);

  automateClient.getSessions(lastBuildId, function (error, sessions) {
    console.log('sessions', sessions);

    var lastSessionId = sessions[0].hashed_id;

    automateClient.getSession(lastSessionId, function (error, session) {
      console.log('session', session);

      // 'passed' or 'failed'
      automateClient.updateSession(lastSessionId, {status: argv._[0]}, function (error, info) {
        console.log('info', info)
      });
    });
  });
});
