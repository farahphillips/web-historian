var path = require('path');
var archive = require('../helpers/archive-helpers');
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
    if (req.url === '/') {
      http.createServer(function(req, res){
      fs.readFile('public/index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
        });
      }).listen(8000);
    }
    // should return the content of a website from the archive
  },
  "POST": function(req, res){
    // should append submitted sites to 'sites.txt'
  },
  "OPTIONS": function(req, res){
    // do something
  }
}

exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
};

exports.handleRequest = function(actionMap){
  return function(req, res) {
    var action = actionMap[req.method];
    if (action) {
      action(req, res);
    } else {
      exports.sendResponse(res, '', 404);
    }
  }
};


// OLD EXPORTS.HANDLEREQUEST CODE
// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
//   if(req.method === 'GET') {

//   }
// };
