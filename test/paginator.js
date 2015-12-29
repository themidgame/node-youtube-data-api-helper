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
    it('should return all the pages for a channel', function(){
      this.timeout(15000);
      var params = {
        'endpoint': 'playlists.list',
        'params': {
            'part':'snippet',
            'channelId':'UCCjyq_K1Xwfg8Lndy7lKMpA',
            'maxResults':'50',
            'key':'AIzaSyBx2lxBJy57YLO2Iu-ksb0CD5n7nZkS0Fs'
          },
      };
      /*var playlistsApi = nock('https://www.googleapis.com')
            .get('/youtube/v3/playlists')
            .query(true)
            .reply(200,{
          });*/
      paginator.options(params);
      return paginator.getAllPages().then(function(responses){
        console.log('should retrieve ',responses[0].pageInfo.totalResults,' playlists');
        var counter = 0;
        responses.forEach(function(response){
          console.log('getting ', response.items.length, ' playlists');
          counter+= response.items.length;
        });
        console.log('got a total of ', counter, 'playlists');
        console.log('expected ',responses[0].pageInfo.totalResults,' got ',counter);
        assert.isTrue(false,'it was totally false');
      });
    });
  });


});
