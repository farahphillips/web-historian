var path = require('path');
var archive = require('../helpers/archive-helpers');
var static = require('node-static');
var http_helper = require('./http-helpers.js')
var url = require('url')


var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  'Content-Type': "application/json"
};


var requestAction = {
  "GET": function(req, res){
    // should return the contents of index.html
    console.log('GET request')
    var urlPath = url.parse(req.url).pathname
    http_helper.serveAssets(res, urlPath,
      function(){
      urlPath === '/' ? '/index.html' : urlPath;
      urlPath = urlPath.slice(1)
      archive.isUrlInList(urlPath,
        function(found){
        if(found) {
          http_helper.serveAssets(res,'/'+urlPath)
        } else {
          http_helper.send404(res)
        }
      })}
    )
  },
  "POST": function(req, res){
    console.log('Got POST')
    var body = "";
    req.on('data', function(data){ body += data});
    req.on('end', function(){
      var urlPath = url.parse(body).pathname
      archive.isUrlInList(urlPath, function(found){
        if (found){
          archive.isUrlArchived(urlPath, function(exists){
            if (exists){
              http_helper.serveAssets(res, urlPath, function(){
                if (urlPath[0] === '/') { urlPath = urlPath.slice(1)}
              });
            } else {
              http_helper.sendRedirect(res, '/loading.html')
            }
          })
        } else {
          archive.addUrlToList(urlPath);
          http_helper.sendRedirect(res, '/loading.html')
        }
      })
    })
       // should append submitted sites to 'sites.txt'
  },
  "OPTIONS": function(req, res){
    console.log('Get OPTIONS')
    exports.sendResponse(res, null);
  }
}

exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
};

exports.makeHandleRequest = function(requestAction){
  return function(req, res) {
    var action = requestAction[req.method];
    console.log('action is ' + action)
    if (action) {
      action(req, res);
    } else {
      exports.sendResponse(res, '', 404);
    }
  }
};

exports.handleRequest = exports.makeHandleRequest(requestAction);

// OLD EXPORTS.HANDLEREQUEST CODE
// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
//   if(req.method === 'GET') {

//   }
// };
