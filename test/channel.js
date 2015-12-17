var youtube = require('../lib/youtube-data-api');

describe('Channel', function(){
  describe('can construct', function(){
    it('should be defined after constructing', function () {
      var channel = youtube.channel();
      assert.isFunction(channel,'The channel should be a function');
    });
  });
});
