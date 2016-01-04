var youtube = require('../lib/youtube'),
  assert = require('chai').assert,
  merge = require('merge'),
  nock = require('nock');

describe('Video', function () {

  describe('constructor', function () {

    it('should set the default parameters to the resulting object', function () {
      var video = youtube.video('v3');

      assert.equal(video.id, null, 'Should set the id property to null when no parameters are given');
      assert.deepEqual(video.options, {}, 'Should set the options property to {} when no parameters are given');

      video = youtube.video({ version: 'v3' });

      assert.equal(video.id, null, 'Should set the id property to null when no parameters are given');
      assert.deepEqual(video.options, {}, 'Should set the options property to {} when no parameters are given');
    });

    it('should set the parameters to the resulting object', function () {
      var parameters = { version: 'v3', id: 'id' },
        video = youtube.video(parameters);

      assert.equal(video.id, parameters.id, 'Should set the id property');
      assert.equal(video.options, parameters, 'Should set the options property');
    });

  });

  describe('comments.listAll', function () {
    var topComment = {
      "kind": "youtube#comment",
      "id": "TopCommentId"
    },
      replies = [
        [
          {
            "kind": "youtube#comment",
            "id": "ReplyId"
          }
        ]
      ];

    nock('https://www.googleapis.com')
      .get('/youtube/v3/commentThreads')
      .query(true)
      .reply(200, {
        "kind": "youtube#commentThreadListResponse",
        "pageInfo": {
          "totalResults": 1,
          "resultsPerPage": 1
        },
        "items": [
          {
            "kind": "youtube#commentThread",
            "id": "ThreadId",
            "snippet": {
              "channelId": "ChannelId",
              "videoId": "VideoId",
              "topLevelComment": topComment,
              "totalReplyCount": 1,
            }
          }
        ]
      });

    nock('https://www.googleapis.com')
      .get('/youtube/v3/comments')
      .query(true)
      .reply(200, {
        "kind": "youtube#commentListResponse",
        "pageInfo": {
          "totalResults": 1,
          "resultsPerPage": 1
        },
        "items": replies
      });

    it('should return an array of comments', function () {
      var parameters = { version: 'v3', id: 'videoId' },
        video = youtube.video(parameters),
        queryParams = {
          key: 'key',
          part: 'part'
        };

      return video.comments.listAll(queryParams, queryParams).then(function (response) {
        assert.isArray(response, 'response should be an array');
        assert.equal(2, response.length, 'response length should be 3');
        assert.deepEqual(response[0], topComment, 'top comment should be in array');
        assert.deepEqual(response[1], replies[0], 'replies should be in array');
      });
    });
  });

});