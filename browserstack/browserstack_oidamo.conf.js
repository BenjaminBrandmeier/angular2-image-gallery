exports.config = {
  'seleniumAddress': 'https://' + process.env.BROWSERSTACK_USERNAME + ':' + process.env.BROWSERSTACK_KEY + '@hub-cloud.browserstack.com/wd/hub',
  allScriptsTimeout: 11000,
  specs: [
    '../e2e/**/*.e2e-spec.ts'
  ],
  'capabilities': {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    'os': 'Windows',
    'os_version': '7',
    'browserName': 'Chrome',
    'browser_version': '57.0',
    'resolution': '1920x1080'
  },
  baseUrl: 'http://oidamo.de/angular2-image-gallery',
  // Code to start browserstack local before start of test
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  }
};
