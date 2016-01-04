var youtube = require('../lib/youtube'),
  assert = require('chai').assert,
  merge = require('merge'),
  nock = require('nock');


describe('Channel', function () {
  describe('constructor', function () {
    it('should return an object with just the version as string', function () {
      var channel = youtube.channel('v3');
      assert.isObject({}, 'The channel should be a function');
    });
    it('should return an object with the version as an object property', function () {
      var channel = youtube.channel({ version: 'v3' });
      assert.isObject(channel, 'The channel should be an object');
    });
    it('should have the id setup if provided', function () {
      var channel = youtube.channel({ version: 'v3', id: '123' });
      assert.equal(channel.id, '123', 'The should have the id property setup');
    });
  });

  describe('playlists', function () {
    var playlists = youtube.channel({ version: 'v3', id: '123' }).playlists;
    it('should be an object', function () {
      assert.isObject(playlists, 'playlists should be an object');
    });
  });

  describe('playlists list', function () {
    var playlists = youtube.channel({ version: 'v3', id: 'UCCjyq_K1Xwfg8Lndy7lKMpA' }).playlists,

      params = {
        part: 'snippet,contentDetails,status,player,localizations',
        key: 'Key',
        maxResults: '50'
      },

      setupNock = function (opts) {
        var defaults = {
          hostname: 'https://www.googleapis.com',
          resource: '/youtube/v3/playlists',
          response: {
            'playlist': 'awesome'
          },
          params: true
        },
          options = merge(defaults, opts),
          youtubeAPI = nock(options.hostname)
            .get(options.resource)
            .query(options.params)
            .reply(200, options.response);
      };

    it('should return a promise', function () {
      setupNock();
      return playlists.list(params).then(function (response) {
        assert.isObject(response, 'the response should be an object');
      });
    });

    it('should return the expected response', function () {
      setupNock();
      return playlists.list(params).then(function (response) {
        assert.deepEqual(response, { 'playlist': 'awesome' }, 'the expected response is not returned');
      });
    });


  });

  describe('playlists get all pages', function(){
    it('should return all the pages', function(){
      nock('https://www.googleapis.com')
            .get('/youtube/v3/playlists')
            .query(true)
            .reply(200,{
               "kind": "youtube#playlistListResponse",
               "nextPageToken": "CDIQAA",
               "pageInfo": {
                  "totalResults": 125,
                  "resultsPerPage": 50
               },
               "items": new Array(50)
             }
            );
      nock('https://www.googleapis.com')
            .get('/youtube/v3/playlists')
            .query(true)
            .reply(200,{
               "kind": "youtube#playlistListResponse",
               "nextPageToken": "CDIQBB",
               "pageInfo": {
                  "totalResults": 125,
                  "resultsPerPage": 50
               },
               "items": new Array(50)
             }
            );
      nock('https://www.googleapis.com')
            .get('/youtube/v3/playlists')
            .query(true)
            .reply(200,{
               "kind": "youtube#playlistListResponse",
               "pageInfo": {
                  "totalResults": 125,
                  "resultsPerPage": 50
               },
               "items": new Array(25)
             }
            );
      var playlists = youtube.channel({ version: 'v3', id: 'UCCjyq_K1Xwfg8Lndy7lKMpA' }).playlists,
          params = {
            part: 'snippet,contentDetails,status,player,localizations',
            key: 'Key',
            maxResults: '50',
            allPages: true,
            mergePages: false,
          };
      return playlists.list(params).then(function (responses) {
        assert.equal(responses.length, 3, 'should contain 3 responses');
      });

    });
  });
});
