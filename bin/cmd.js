#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var router = require('routes')(); // server side router
var http = require('http');
var minimist = require('minimist');

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

