var google = require('googleapis'),
  youtube = google.youtube('v3'),
  merge = require('merge'),
  Paginator = require('../../lib/paginator');


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
      var options = Object.assign({}, params);
      options.videoId = video.id;

      if (options.all) {
        delete options.all;

        var paginatorOptions = {
          endpoint: 'commentThreads.list',
          params: options
        };

        var paginator = new Paginator(paginatorOptions);
        return paginator.getAllPages();
      } else {

        return new Promise(function (resolve, reject) {
          youtube.commentThreads.list(options, getResponseHandler(resolve, reject));
        });
      }
    },

    getCommentThreadWithAllReplies: function (commentThread, commentsOptions) {
      if (commentThread.snippet.totalReplyCount == 0) {
        commentThread.replies = {
          comments: []
        };

        return Promise.resolve(commentThread);
      }

      var options = Object.assign({}, commentsOptions);
      options.parentId = commentThread.snippet.topLevelComment.id;

      var paginatorOptions = {
        endpoint: 'comments.list',
        params: options
      };

      var paginator = new Paginator(paginatorOptions);

      return paginator.getAllPages().then(function (commentPages) {
        var comments = [];

        commentPages.forEach(function (page) {
          comments.push.apply(comments, page.items);
        }, this);

        commentThread.replies = {
          comments: comments
        };

        return commentThread;
      });
    },

    getCommentThreadListWithAllReplies: function (commentThreads, commentsOptions) {
      var promises = commentThreads.map(function (commentThread) {
        return video.comments.getCommentThreadWithAllReplies(commentThread, commentsOptions);
      });

      return Promise.all(promises);
    },

    getCommentThreadsResponseWithAllReplies: function (commentThreadResponse, commentsOptions) {
      return video.comments.getCommentThreadListWithAllReplies(commentThreadResponse.items, commentsOptions).then(function (threadList) {
        commentThreadResponse.items = threadList;
        return commentThreadResponse;
      });
    },

    listThreadsWithAllReplies: function (commentThreadsOptions, commentsOptions) {
      return video.comments.listThreads(commentThreadsOptions).then(function (response) {

        if (response instanceof Array) {
          var promises = response.map(function (responseItem) {
            return video.comments.getCommentThreadsResponseWithAllReplies(responseItem, commentsOptions);
          });

          return Promise.all(promises);
        } else {
          return video.comments.getCommentThreadsResponseWithAllReplies(response, commentsOptions);
        }
      });
    },

    listAll: function (commentThreadsOptions, commentsOptions) {
      return video.comments.listThreadsWithAllReplies(commentThreadsOptions, commentsOptions).then(function (commentThreadsPages) {
        if (!(commentThreadsPages instanceof Array)) {
          commentThreadsPages = [commentThreadsPages];
        }

        var paginator = new Paginator(),
          commentThreads = paginator.mergePages(commentThreadsPages),
          comments = [];

        commentThreads.items.forEach(function (commentThread) {
          var topLevelComment = commentThread.snippet.topLevelComment,
            commentReplies = commentThread.replies.comments;

          comments.push(topLevelComment);
          comments.push.apply(comments, commentReplies);
        }, this);

        return comments;
      });
    }
  };
}


/**
 * Exports the Video class
 * @type Video
 */
module.exports = Video;