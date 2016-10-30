const ROOT = "../../";
const specFiles = ROOT + '.build/public/app/**/*.spec.js';

// Karma configuration
module.exports = function(config) {
  let options = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // Polyfills
      ROOT + 'node_modules/core-js/client/shim.js',
      ROOT + 'node_modules/reflect-metadata/Reflect.js',

      // zone.js
      ROOT + 'node_modules/zone.js/dist/zone.js',
      ROOT + 'node_modules/zone.js/dist/long-stack-trace-zone.js',
      ROOT + 'node_modules/zone.js/dist/proxy.js',
      ROOT + 'node_modules/zone.js/dist/sync-test.js',
      ROOT + 'node_modules/zone.js/dist/jasmine-patch.js',
      ROOT + 'node_modules/zone.js/dist/async-test.js',
      ROOT + 'node_modules/zone.js/dist/fake-async-test.js',

      // RxJs
      { pattern: ROOT + 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: ROOT + 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: ROOT + 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: ROOT + 'node_modules/@angular/**/*.js.map', included: false, watched: false },

      // app file
      ROOT + '.build/public/app/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies

      // webpack configuration
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  };

  options.preprocessors[specFiles] = ['webpack'];

  config.set(options);
};