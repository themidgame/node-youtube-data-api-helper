var google = require('googleapis'),
    Promise = require('bluebird'),
    youtube = google.youtube('v3');


function getResponseHandler(resolve, reject) {
  return function (err, response) {
    if (err) {
      reject(err);
    } else {
      resolve(response);
    }
  };

}


/**
 * Channel extension to the YouTube data api channel resource.
 */
function Channel (options) {
  var self = this;
  this._options = options || {};
  this.playlists = {
    list: function(opts){
      var params = opts || {};
      params.channelId = self.id;
      return new Promise(function(resolve, reject) {
        youtube.playlists.list(params, getResponseHandler(resolve, reject));
      });
    }
  };

  this.id = this._options.id || null;
}


/**
 * Exports the Channel object
 * @type Channel
 */
module.exports = Channel;
