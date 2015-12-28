var youtube = require('../lib/youtube'),
  assert = require('chai').assert,
  merge = require('merge'),
  nock = require('nock');


describe('Video', function () {

  describe('constructor', function () {
    it('should return an object with just the version as string', function () {
      var video = youtube.video('v3');
      assert.isObject({}, 'The video should be a function');
    });

    it('should return an object with the version as an object property', function () {
      var video = youtube.video({ version: 'v3' });
      assert.isObject(video, 'The video should be an object');
    });

    it('should have the id setup if provided', function () {
      var video = youtube.video({ version: 'v3', id: '123' });
      assert.equal(video.id, '123', 'The should have the id property setup');
    });
  });

  describe('commentThreads list', function () {
    var video = youtube.video({ version: 'v3', id: 'cn1BkbV2Cws' }),

      options = {
        key: 'AIzaSyBx2lxBJy57YLO2Iu-ksb0CD5n7nZkS0Fs',
        part: 'id,replies,snippet'
      },

      setupNock = function (nockOptions) {
        var defaults = {
          hostname: 'https://www.googleapis.com',
          resource: '/youtube/v3/commentThreads',
          response: {
            'kind': 'youtube#commentThreadListResponse',
            'items': ['item']
          },
          params: true
        },
          params = merge(defaults, nockOptions);

        nock(params.hostname)
          .get(params.resource)
          .query(params.params)
          .reply(200, params.response);
      },

      restoreNock = function () {
        nock.cleanAll();
      };

    this.timeout(30000);

    it('should return a promise', function () {
      setupNock();
      return video.commentThreads.list(options).then(function (response) {
        assert.isObject(response, 'the response should be an array');
        restoreNock();
      });
    });

    it('should return the expected response', function () {
      setupNock();
      return video.commentThreads.list(options).then(function (response) {
        assert.deepEqual(response.items, ['item'], 'the expected response was not returned');
        assert.deepEqual(response.kind, 'youtube#commentThreadListResponse', 'the expected response was not returned');
        restoreNock();
      });
    });

    it('client manual test', function () {
      return video.commentThreads.listAll(options).then(function (response) {
        assert.isTrue(true, 'should be true');
        console.log(response);
      });
    });
  });

});
