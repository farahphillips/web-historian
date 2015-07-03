var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var static = require('node-static');
var requestHandler = require('./request-handler.js')

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
// allowed file types
  var encoding = {encoding : 'utf8'}
  console.log('Assets are ' + asset)
  asset = '/' + asset;

  fs.readFile(archive.paths.siteAssets + asset, encoding, function(err, data){
    if(err) {
      fs.readFile(archive.paths.archivedSites + asset, encoding, function(err, data) {
        if (err) {
          callback ? callback() : requestHandler.send404(res)
        } else {
          console.log('IT\'S HAPPENING')
          exports.sendRedirect(res, asset)
          // res.writeHead(200, headers);
          // res.end(data);
        }
      })
    } else {
      exports.sendRedirect(res, asset)
      // requestHandler.sendResponse(res,data)
    }
  })
};

exports.send404 = function(res){
  requestHandler.sendResponse(res, '404: Page not found', 404)
}

exports.sendRedirect = function(res, location, status){
  status = status || 302
  res.writeHead(status, {Location:location});
  res.end()
}
