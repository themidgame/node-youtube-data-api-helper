var YouTubeDataAPI = require('../lib/youtube'),
    assert = require('chai').assert,
    nock = require('nock');

describe('Playlist', function(){
  describe('should be able to retrieve', function(){
    it('the number of videos a playlist has', function(){
      nock('https://www.googleapis.com')
          .get('/youtube/v3/playlists')
          .query(true)
          .reply(200, {
               "items": [
                {
                 "contentDetails": {
                  "itemCount": 99
                 }
                }
               ]
            });
          var youtube = new YouTubeDataAPI({'key': 'key'}),
              playlist = youtube.playlist({ version: 'v3', id: 'PLcI7eQ089VxFvlpjlxcUof6mwphE4wx6l' });
      return playlist.getNumberOfVideos().then(function(numberOfVideos){
          assert.equal(numberOfVideos,99);
      });
    });
  });
});
