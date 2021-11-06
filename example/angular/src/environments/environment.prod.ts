/// Hack environment to conditionally load environment.local.  If it doesn't exist, a warning
/// is generated but the app works.
///
/// If environment.local does exist, you can export your own custom GOOGLE_MAP_API_KEY, eg:
///
/// module.exports = {
///   GOOGLE_MAP_API_KEY: "<my api key>"
/// }
///
declare function require(name:string);

var SECRETS = {
  GOOGLE_MAP_API_KEY: ''
};

try {
  SECRETS = require('./environment.local');
} catch (e) {

}

export const environment = {
  TRACKER_HOST: 'http://tracker.transistorsoft.com',
  GOOGLE_MAP_API_KEY: SECRETS.GOOGLE_MAP_API_KEY,
  production: true
}