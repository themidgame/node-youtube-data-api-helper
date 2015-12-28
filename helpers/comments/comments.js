function CommentsHelper(apiClient) {
  this.client = apiClient;
  this.queryParams = null;
}

CommentsHelper.prototype = {
  constructor: CommentsHelper,

  getAllReplies: function (commentThreadsResponse, queryParams) {
    this.queryParams = queryParams || {};
    this.queryParams.part = 'id,snippet';

    var promises = this.getAllRepliesFromCommentThreads(commentThreadsResponse.items);

    return Promise.all(promises).then(function (commentThreadItemsWithReplies) {
      commentThreadsResponse.items = commentThreadItemsWithReplies;
      return commentThreadItemsWithReplies;
    });
  },

  getAllRepliesFromCommentThreads: function (commentThreads) {
    var component = this;

    return commentThreads.map(function (commentThread) {
      if (commentThread.snippet.totalReplyCount > 0) {
        return component.getAllRepliesForCommentThread(commentThread);
      } else {
        return Promise.resolve(commentThread);
      }
    }, this);

  },

  getAllRepliesForCommentThread: function (commentThread) {
    var component = this;

    return new Promise(function (resolve, reject) {
      component.queryParams.parentId = commentThread.snippet.topLevelComment.id;

      component.client.comments.list(component.queryParams, function (err, comments) {
        if (err) {
          reject(err);
        } else {
          commentThread.replies.comments = comments;
          resolve(commentThread);
        }
      });
    });

  }



};

module.exports = CommentsHelper;
