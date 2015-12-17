var google = require('googleapis'),
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

    list: function(params){
      params.channelId = self.channelId;
      return new Promise(function(resolve, reject) {
        youtube.playlists.list(params, getResponseHandler(resolve, reject));
      });
    }

  };
}


/**
 * Exports the Channel object
 * @type Channel
 */
module.exports = Channel;
