var paginator = require('../lib/paginator'),
  assert = require('chai').assert,
  merge = require('merge'),
  nock = require('nock');


describe('Paginator', function(){
  describe('constructor', function(){
    it('should accept options', function(){
      var options = {
        'url': 'whatever'
      };
      paginator.options(options);
      assert.isObject(paginator.getOptions(), 'the options should be an object');
      assert.deepEqual(paginator.getOptions(), options, 'the options in paginator should be the ones given to it.');
    });

  });

  describe('get all pages', function(){
    it('should validate the required parameters', function(){
      var wrongParams = {
        'whatever': true,
      };
      paginator.options(wrongParams);
      assert.throws(paginator.getAllPages,Error,'missing required params');
    });
    it('should return all the pages for an endpoint', function(){
      var params = {
        'endpoint': 'playlists.list',
        'params': {
            'part':'snippet',
            'channelId':'UCCjyq_K1Xwfg8Lndy7lKMpA',
            'maxResults':'50',
            'key':'YourKey'
          },
      };
      //Setup 3 mock calls to the api
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
      paginator.options(params);
      return paginator.getAllPages().then(function(responses){
        assert.equal(responses.length, 3, 'should contain 3 responses');
      });
    });
  });


});
