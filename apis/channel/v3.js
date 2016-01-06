var google = require('googleapis'),
    Promise = require('bluebird'),
    Paginator = require('../../lib/paginator'),
    youtube = google.youtube('v3');

/**
 * Channel extension to the YouTube data api channel resource.
 */
function Channel (options) {
  var self = this;
  this._options = options || {};
  this.playlists = {
    list: function (opts) {
      var params = Object.assign({}, opts);
      params.channelId = self.id;
      if(params.allPages){
        delete params.allPages;
        var mergePages = params.mergePages;
        delete params.mergePages;
        var paginator = new Paginator({
          'endpoint': 'playlists.list',
          'params': params,
          'mergePages': mergePages,
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
