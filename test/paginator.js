var Paginator = require('../lib/paginator'),
  assert = require('chai').assert,
  merge = require('merge'),
  nock = require('nock');


describe('Paginator', function () {
  describe('constructor', function () {
    it('should accept options', function () {
      var options = {
        'url': 'whatever'
      };
      var paginator = new Paginator(options);
      assert.isObject(paginator.getOptions(), 'the options should be an object');
      assert.deepEqual(paginator.getOptions(), options, 'the options in paginator should be the ones given to it.');
    });

  });

  describe('get all pages', function () {
    var setupNocks = function () {
      //Setup 3 mock calls to the api
      nock('https://www.googleapis.com')
        .get('/youtube/v3/playlists')
        .query(true)
        .reply(200, {
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
        .reply(200, {
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
        .reply(200, {
          "kind": "youtube#playlistListResponse",
          "pageInfo": {
            "totalResults": 125,
            "resultsPerPage": 50
          },
          "items": new Array(25)
        }
          );
    };
    it('should validate the required parameters', function () {
      var wrongParams = {
        'whatever': true,
      };
      var paginator = new Paginator(wrongParams);
      assert.throws(paginator.getAllPages, Error, 'missing required params');
    });
    it('should return all the pages for an endpoint', function () {
      var params = {
        'endpoint': 'playlists.list',
        'params': {
          'part': 'snippet',
          'channelId': 'UCCjyq_K1Xwfg8Lndy7lKMpA',
          'maxResults': '50',
          'key': 'YourKey'
        },
      };
      setupNocks();
      var paginator = new Paginator(params);
      return paginator.getAllPages().then(function (responses) {
        assert.equal(responses.length, 3, 'should contain 3 responses');
      });
    });
    it('should merge all the pages', function () {
      var params = {
        'endpoint': 'playlists.list',
        'params': {
          'part': 'snippet',
          'channelId': 'UCCjyq_K1Xwfg8Lndy7lKMpA',
          'maxResults': '50',
          'key': 'YourKey'
        },
        'mergePages': true,
      };
      setupNocks();
      var paginator = new Paginator(params);
      return paginator.getAllPages().then(function (response) {
        assert.equal(response.items.length, 125, 'all the items should be merged into one');
        assert.isDefined(response.pageInfo, 'page info should be defined');
        assert.isDefined(response.pageInfo.totalResults, 'total results should be defined in page info');
        assert.equal(response.pageInfo.totalResults, 125, 'total results should be computed');
      });
    });
  });

  describe('merge pages', function () {
    it('should validate the pages passed to it', function () {
      var paginator = new Paginator();
      assert.throws(function () { paginator.mergePages(null); }, Error, 'must provide an array containing pages');
      assert.throws(function () { paginator.mergePages({}); }, Error, 'must provide an array containing pages');
      assert.throws(function () { paginator.mergePages(new Array(0)); }, Error, 'must provide an array containing pages');
    });
    it('should merge the items within multiple pages', function () {
      var pages = [
        {
          pageInfo: {
            totalResults: 67,
            resultsPerPage: 50
          },
          items: new Array(50)
        },
        {
          pageInfo: {
            totalResults: 67,
            resultsPerPage: 50
          },
          items: new Array(17)
        }
      ];

      var paginator = new Paginator(),
        mergedPages = paginator.mergePages(pages);
      assert.isObject(mergedPages, 'the result should be an object');
      assert.equal(mergedPages.pageInfo.totalResults, 67, 'the totalResults should be updated');
      assert.equal(mergedPages.items.length, 67, 'items should contain the items of all pages');


    });
  });


});
