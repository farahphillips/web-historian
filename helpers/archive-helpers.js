var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('../node_modules/http-request')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

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

// helper function for exports.downloadUrls
exports.downloadFile = function(file_url) {
  var file = fs.createWriteStream(exports.paths.archivedSites + '/' + file_url);

  http.get(file_url, function(res) {
    res.on('data', function(data) {
      file.write(data);
    }).on('end', function() {
      file.end();
    });
  });
};

exports.downloadUrls = function(urlArray){
  _.each(urlArray, function(url){
    exports.downloadFile(url);
    exports.addUrlToList(url);
  })
};
