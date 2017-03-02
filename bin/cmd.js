#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var http = require('http');
var spawn = require('child_process').spawn;

var through = require('through2');
var router = require('routes')(); // server side router
var websocket = require('websocket-stream');
var minimist = require('minimist');
var rpc = require('rpc-multistream');

var rpcServer;

// parse command line arguments
var argv = minimist(process.argv.slice(2), {
    alias: {
        d: 'debug',
        p: 'port',
        s: 'settings'
    },
    boolean: [
        'debug'
    ],
    default: {
        settings: '../settings.js',
        home: path.dirname(__dirname),
        port: 8000
    }
});

var settings = require(argv.settings);
settings.debug = argv.debug || settings.debug;

var ecstatic = require('ecstatic')({
    root: 'www/',
    baseDir: 'www',
    gzip: true,
    cache: 1,
    mimeTypes: {'mime-type':['image/svg+xml','jpg', 'png']}
});


// static files
router.addRoute('/www/*', function(req, res, match) {
    return ecstatic(req, res);
});

// default route serving index.html
router.addRoute('/*', function(req, res, match) {
    var rs = fs.createReadStream(path.join('./index.html'));
    rs.pipe(res);
});


// initialize http server
var server = http.createServer(function(req, res) {
    var m = router.match(req.url);
    m.fn(req, res, m);
});

console.log("Starting http server on " + (settings.hostname || '*') + " port " + settings.port);

// start http server
server.listen(settings.port, settings.hostname);



// start websocket listener
websocket.createServer({server: server}, function(stream) {

  // the methods available via RPC
  rpcServer = rpc({

    foo: function(cb) {
      console.log("foo called");
      cb(null, "foo says hi");
    },

    // get babel output
    babelRoutes: rpc.syncReadStream(function() {
      
      var parts = settings.babeld_cmd.trim().split(/\s+/);
      var cmd = parts[0];
      var args = parts.slice(1);
      var babeld = spawn(cmd, args, {shell: true});

      // matches a babeld output lines
      var isLine = /^[^\n]*\n/;
      var isRoute = /^(\d+\.\d+\.\d+\.\d+)\/(\d+)\s+(.*)\n/;
      var m1, m2;
      var str = '';
      // TODO 
      // we should be able to just return babeld.stdout
      // but rpc-multistream does not currently have a way to
      // specify objectMode for rpc.sync*Stream calls
      // and the explicit:true mode only works when returning
      // streams async
      // TODO also change rpc-multistream to use explicit:true per default
      //      since it is less confusing
      var s = through.obj(function(data, encoding, cb) {
        str += data.toString();

        while(m1 = str.match(isLine)) {
          m2 = str.match(isRoute);
          str = str.slice(m1[0].length) 

          if(!m2) continue; // ignore non-route lines

          var o = {
            ip: m2[1],
            subnet: parseInt(m2[2]),
            data: m2[3]
          };

          if(o.ip === '0.0.0.0') continue;

          this.push(o);
        }
        cb();        
      });

      // TODO give error if babeld.close gives error
      // TODO what about babeld.stderr?
      babeld.stdout.pipe(s);
      return s;
    })
    
  }, {
    objectMode: true,
    debug: false
  });

  rpcServer.on('error', function(err) {
    console.error("Connection error (client disconnect?):", err);
  });

  rpcServer.pipe(stream).pipe(rpcServer);
});


