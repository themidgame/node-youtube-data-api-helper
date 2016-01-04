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
    var topComment1 = {
      "kind": "youtube#comment",
      "id": "TopCommentId1"
    },
      topComment2 = {
        "kind": "youtube#comment",
        "id": "TopCommentId2"
      },
      replies1 = [
        {
          "kind": "youtube#comment",
          "id": "ReplyId1"
        },
        {
          "kind": "youtube#comment",
          "id": "ReplyId2"
        }
      ],
      replies2 = [
        {
          "kind": "youtube#comment",
          "id": "ReplyId3"
        },
        {
          "kind": "youtube#comment",
          "id": "ReplyId4"
        }
      ];

    nock('https://www.googleapis.com')
      .get('/youtube/v3/commentThreads')
      .query(true)
      .reply(200, {
        "kind": "youtube#commentThreadListResponse",
        "nextPageToken": "token",
        "pageInfo": {
          "totalResults": 1,
          "resultsPerPage": 1
        },
        "items": [
          {
            "kind": "youtube#commentThread",
            "id": "ThreadId1",
            "snippet": {
              "channelId": "ChannelId",
              "videoId": "VideoId",
              "topLevelComment": topComment1,
              "totalReplyCount": 2,
            }
          }
        ]
      });

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
            "id": "ThreadId2",
            "snippet": {
              "channelId": "ChannelId",
              "videoId": "VideoId",
              "topLevelComment": topComment2,
              "totalReplyCount": 2,
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
          "totalResults": 2,
          "resultsPerPage": 2
        },
        "items": replies1
      });

    nock('https://www.googleapis.com')
      .get('/youtube/v3/comments')
      .query(true)
      .reply(200, {
        "kind": "youtube#commentListResponse",
        "pageInfo": {
          "totalResults": 2,
          "resultsPerPage": 2
        },
        "items": replies2
      });

    it('should return an array of comments', function () {
      var parameters = { version: 'v3', id: 'videoId' },
        video = youtube.video(parameters),
        queryParams = {
          key: 'key',
          part: 'part',
          all: true
        };

      return video.comments.listAll(queryParams, queryParams).then(function (response) {
        assert.isArray(response, 'response should be an array');
        assert.equal(6, response.length, 'response length should be 3');
        assert.deepEqual(response[0], topComment1, 'top comment 1 should be in array');
        assert.deepEqual(response[1], replies1[0], 'replies should be in array');
        assert.deepEqual(response[2], replies1[1], 'replies should be in array');
        assert.deepEqual(response[3], topComment2, 'top comment 2 should be in array');
        assert.deepEqual(response[4], replies2[0], 'replies should be in array');
        assert.deepEqual(response[5], replies2[1], 'replies should be in array');
      });
    });
  });

});