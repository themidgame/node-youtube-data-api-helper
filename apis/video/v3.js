var google = require('googleapis'),
  youtube = google.youtube('v3'),
  CommentThreadsHelper = require('../../helpers/commentThreads/commentThreads');


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
 * Video extension to the YouTube data api video resource.
 */

function Video(options) {
  var self = this;

  this._options = options || {};
  this.id = options.id || null;

  this.commentThreads = {

    list: function (params) {
      var commentThreadsHelper = new CommentThreadsHelper(),
        queryParams = params || {};

      queryParams.videoId = self.id;

      return commentThreadsHelper.listAll(youtube, queryParams, getResponseHandler);
    }
  };
}


/**
 * Exports the Video class
 * @type Video
 */
module.exports = Video;