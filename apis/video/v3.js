var google = require('googleapis'),
  youtube = google.youtube('v3'),
  CommentThreadsHelper = require('../../helpers/commentThreads/commentThreads'),
  CommentsHelper = require('../../helpers/comments/comments');


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
      var commentThreadsHelper = new CommentThreadsHelper(youtube),
        queryParams = params || {};

      queryParams.videoId = self.id;
      queryParams.maxResults = 100;

      return commentThreadsHelper.listAll(queryParams);
    },

    listAll: function (params) {
      var commentsHelper = new CommentsHelper(youtube);

      return self.commentThreads.list(params)
        .then(function (commentThreadsResponse) {
          return commentsHelper.getAllReplies(commentThreadsResponse, params);
        });
    }
  };
}


/**
 * Exports the Video class
 * @type Video
 */
module.exports = Video;