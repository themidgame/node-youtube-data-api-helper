var google = require('googleapis'),
    Promise = require('bluebird'),
    _ = require("underscore"),
    youtube = google.youtube('v3');


/**
 * Playlist extension to the YouTube data api playlist resource.
 */

function Playlist(options) {
  var self = this;

  self.options = options || {};
  self.id = options.id || null;

  this.getInfo = function(params){
    var playlist = Promise.promisify(youtube.playlists.list);
        defaultParams = {
          'key': self.youtube.getKey(),
          'part':'snippet',
          'maxResults':'1',
          'id': self.id
        };
        _.defaults(params, defaultParams);
      return playlist(params);
  };

  this.getNumberOfVideos = function(){
        return self.getInfo({'part':'contentDetails'}).then(function(playlistInfo){
          return playlistInfo.items[0].contentDetails.itemCount;
        }).catch(function(e) {
            console.log("Error", e);
        });
    };
}


/**
 * Exports the Playlist class
 * @type Playlist
 */
module.exports = Playlist;
