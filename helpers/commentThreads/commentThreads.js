
function CommentThreadsHelper() {
  this.client = null;
  this.responseHandler = null;
  this.store = {
    comments: [],
    params: null
  };
}

CommentThreadsHelper.prototype = {
  constructor: CommentThreadsHelper,

  listAll: function (apiClient, params, responseHandler) {
    this.client = apiClient;
    this.responseHandler = responseHandler;
    this.store.params = params;

    return this.loadPage().then(this.loadNextPage.bind(this));
  },

  loadPage: function (token) {
    return this.queryForComments(token)
      .then(this.storeComments.bind(this))
      .then(this.getNextPageToken);
  },

  queryForComments: function (nextPageToken) {
    var component = this,
      params = this.store.params;

    if (nextPageToken) {
      params.pageToken = nextPageToken;
    } else {
      delete params.pageToken;
    }

    return new Promise(function(resolve, reject) {
      component.client.commentThreads.list(params, component.responseHandler(resolve, reject));
    });
  },

  storeComments: function (data) {
    this.store.comments = this.store.comments.concat(data.items);
    return data;
  },

  getNextPageToken: function (data) {
    return data.nextPageToken;
  },

  loadNextPage: function (token) {
    if (!token) {
      var responseObject = {
        'kind': 'youtube#commentThreadListResponse',
        'items': this.store.comments
      };

      return Promise.resolve(responseObject);
    }

    return this.loadPage(token).then(this.loadNextPage.bind(this));
  }
};

module.exports = CommentThreadsHelper;
