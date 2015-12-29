var Promise = require('bluebird'),
    google = require('googleapis'),
    youtube = google.youtube('v3');

/**
 * Paginator Constructor
 * @constructor
 */
function Paginator(options){
  var component = this;
  this.options(options);
  this.getAllPages = function(responses){
    if(!component._options.endpoint || !component._options.params ){
      throw new Error('missing required params');
    }
    else{
      if(!responses) responses = [];
      return component.getPage().then(function(response){
        responses.push(response);
        if(response.nextPageToken){
          component._options.params.pageToken = response.nextPageToken;
          return component.getAllPages(responses);
        }
        else{
          return responses;
        }
      });

    }
  };
  this.getPage = function(){
    return component.executeFunctionByName(component._options.endpoint, youtube, component._options.params);
  };
  this.executeFunctionByName = function (functionName, context /*, args */) {
    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    var promisified = Promise.promisify(context[func]);
    return promisified.apply(this, args);
  };
}

/**
 * Set options
 * @param  {Object} opts Options to set
 */
Paginator.prototype.options = function(opts) {
  this._options = opts || {};
};

Paginator.prototype.getOptions = function(){
  return this._options;
};


var paginator = new Paginator();

module.exports = paginator;
