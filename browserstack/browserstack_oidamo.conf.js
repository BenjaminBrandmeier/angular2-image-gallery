exports.config = {
  'seleniumAddress': 'https://' + process.env.BROWSERSTACK_USERNAME + ':' + process.env.BROWSERSTACK_KEY + '@hub-cloud.browserstack.com/wd/hub',
  allScriptsTimeout: 30000,
  specs: [
    '../e2e/**/*.e2e-spec.ts'
  ],
  'commonCapabilities': {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_KEY
  },
  'multiCapabilities': [{
    'browserName': 'Chrome',
    'os': 'OSX'
  }],
  baseUrl: 'http://oidamo.de/angular2-image-gallery',
  // Code to start browserstack local before start of test
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  }
};
