var youtube = require('../lib/youtube'),
  assert = require('chai').assert,
  merge = require('merge');

describe('Video', function () {

  describe('commentThreads list', function () {
    var video = youtube.video({ version: 'v3', id: 'cn1BkbV2Cws' }),
      options = {
        key: 'AIzaSyBx2lxBJy57YLO2Iu-ksb0CD5n7nZkS0Fs',
        maxResults: 100,
        part: 'id,replies,snippet,bad'
      };

    this.timeout(15000);

    it('should return the comment threads', function () {
      return video.commentThreads.list(options).then(function (response) {
        assert.isTrue(true, 'should have returned false');
        console.log(response);
        console.log('Response length:', response.length);
      });
    });
  });

});
