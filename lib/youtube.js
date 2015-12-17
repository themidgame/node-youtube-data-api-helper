/**
 * A module to extend the functionality of the YouTube Data API
 * @module youtube-data-api
 */

/**
 * Load the apis
 * @private
 */
var apis = require('../apis');

/**
 * YouTubeDataAPI constructor
 * @param {object} options Options to configure the helper.
 * @constructor
 */
function YouTubeDataAPI (options) {
  this.options(options);
  this.addAPIs(apis);
}

/**
 * Set options
 * @param  {Object} opts Options to set
 */
YouTubeDataAPI.prototype.options = function(opts) {
  this._options = opts || {};
};


/**
 * Add APIs endpoints to youtubedataapi object
 * E.g. youtubedataapi.channel
 *
 * @param {Array} apis Apis to be added
 * @private
 */
YouTubeDataAPI.prototype.addAPIs = function(apis) {
  for (var apiName in apis) {
    this[apiName] = apis[apiName].bind(this);
  }
};

var youtube = new YouTubeDataAPI();

module.exports = youtube;
