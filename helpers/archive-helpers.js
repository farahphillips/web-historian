var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('../node_modules/http-request');
var request = require('../node_modules/request');

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function(err, data){
    if (err) throw err;
    callback(data.toString().split('\n'))
  })
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(list){
    callback(list.indexOf(url) !== -1)
  })
};

exports.addUrlToList = function(url, callback){
  exports.isUrlInList(url, function(inList) {
    if(!inList) {
      fs.appendFile(exports.paths.list, url, function(err){
        if (err) throw err;
        callback();
       })
    }
  })
};

exports.isUrlArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    if (err) throw err;
    callback(files.indexOf(url) !== -1)
  })
};

exports.downloadUrls = function(urlArray){
  for (var i = 0; i < urlArray.length; i++) {
    var uri = "http://" + urlArray[i];
    request(uri).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + urlArray[i]))
    exports.addUrlToList(urlArray[i]);
  }
};
