var browserstack = require('browserstack-local');

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
    'resolution': '1920x1080',
    'browserstack.local': true
  },
  baseUrl: 'http://localhost:4200/',
  // Code to start browserstack local before start of test
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    console.log("Connecting local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.capabilities['browserstack.key']}, function (error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function () {
    return new Promise(function (resolve, reject) {
      exports.bs_local.stop(resolve);
    });
  }
};
