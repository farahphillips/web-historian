var path = require('path');
var archive = require('../helpers/archive-helpers');
var static = require('node-static');
// require more modules/folders here!

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
    if (req.url === '/') {
    }
    // should return the content of a website from the archive
  },
  "POST": function(req, res){
    console.log('Got POST')
    var body = "";
    req.on('data', function(data){ body += data});
    req.on('end', function(){
      if (archive.isUrlInList(body)) {
        // get request
      } else {
        archive.addUrlToList(body);
      }
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
