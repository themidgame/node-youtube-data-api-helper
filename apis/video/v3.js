var google = require('googleapis'),
  youtube = google.youtube('v3'),
  merge = require('merge'),
  paginator = require('../../lib/paginator');


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
  var video = this;

  video.options = options || {};
  video.id = options.id || null;

  this.comments = {

    listThreads: function (params) {
      params.videoId = video.id;

      if (params.all) {
        delete params.all;

        var paginatorOptions = {
          endpoint: 'commentThreads.list',
          params: params
        };

        paginator.options(paginatorOptions);
        return paginator.getAllPages();
      } else {

        return new Promise(function (resolve, reject) {
          youtube.commentThreads.list(params, getResponseHandler(resolve, reject));
        });
      }
    },

    getCommentThreadWithAllReplies: function (commentThread, commentOptions) {
      if (!commentOptions.id && !commentOptions.parentId) {
        commentOptions.parentId = commentThread.snippet.topLevelComment.id;
      }

      var paginatorOptions = {
        endpoint: 'comments.list',
        params: commentOptions
      };

      paginator.options(paginatorOptions);

      return paginator.getAllPages().then(function (commentPages) {
        var comments = [];

        commentPages.forEach(function (page) {
          comments.push.apply(comments, page.items);
        }, this);

        commentThread.replies.comments = comments;
        return commentThread;
      });
    },

    getCommentThreadListWithAllReplies: function (commentThreads, commentOptions) {
      var promises = commentThreads.map(function (commentThread) {
        return video.comments.getCommentThreadWithAllReplies(commentThread, commentOptions);
      });

      return Promise.all(promises);
    },

    getCommentThreadsResponseWithAllReplies: function (commentThreadResponse, commentOptions) {
      return video.comments.getCommentThreadListWithAllReplies(commentThreadResponse.items, commentOptions).then(function (threadList) {
        commentThreadResponse.items = threadList;
        return commentThreadResponse;
      });
    },

    listThreadsWithAllReplies: function (commentThreadOptions, commentOptions) {
      return video.comments.listThreads(commentThreadOptions).then(function (response) {

        if (response instanceof Array) {
          var promises = response.map(function (responseItem) {
            return video.comments.getCommentThreadsResponseWithAllReplies(responseItem, commentOptions);
          });

          return Promise.all(promises);
        } else {
          return video.comments.getCommentThreadsResponseWithAllReplies(response, commentOptions);
        }
      });
    }

  };
}


/**
 * Exports the Video class
 * @type Video
 */
module.exports = Video;