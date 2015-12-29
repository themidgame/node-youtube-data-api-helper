var google = require('googleapis'),
    Promise = require('bluebird'),
    paginator = require('../../lib/paginator'),
    youtube = google.youtube('v3');
    
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
      if(params.allPages){
        delete params.allPages;
        paginator.options({
          'endpoint': 'playlists.list',
          'params': params
        });
        return paginator.getAllPages();
      }
      else{
        promisified = Promise.promisify(youtube.playlists.list);
        return promisified(params);
      }
    }
  };

  this.id = this._options.id || null;
}


/**
 * Exports the Channel object
 * @type Channel
 */
module.exports = Channel;
