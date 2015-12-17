var youtube = require('../lib/youtube'),
    assert = require('chai').assert;


describe('Channel', function(){
  describe('constructor', function(){
    it('should return an object with just the version as string', function () {
      var channel = youtube.channel('v3');
      assert.isObject({},'The channel should be a function');
    });
    it('should return an object with the version as an object property', function () {
      var channel = youtube.channel({version:'v3'});
      assert.isObject(channel,'The channel should be an object');
    });
    it('should have the id setup if provided', function () {
      var channel = youtube.channel({version:'v3',id:'123'});
      assert.equal(channel.id,'123','The should have the id property setup');
    });
  });

  describe('playlists', function () {
    var playlists = youtube.channel({version:'v3',id:'123'}).playlists;
    it('should be an object', function () {
      assert.isObject(playlists, 'playlists should be an object');
    });
  });
});
