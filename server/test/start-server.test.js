'use strict';

var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');
var originalArgv = process.argv;

module.exports = {
  testCreateServer : function(test) {
    var listen = startMockServer().listenSpy;
    test.ok(listen.calledOnce, 'Listen never called');
    test.equal(8080, listen.firstCall.args[0], 'Unexpected port');
    test.done();
  },
  testCreateServerDashP : function(test){
    var listen = startMockServer(['-p', '8000']).listenSpy;
    test.ok(listen.calledOnce, 'Listen never called');
    test.equal(8000, listen.firstCall.args[0], 'Unexpected port');
    test.done();
  },
  testCreateServerDashDashPort : function(test){
    var listen = startMockServer(['--port', '8000']).listenSpy;
    test.ok(listen.calledOnce, 'Listen never called');
    test.equal(8000, listen.firstCall.args[0], 'Unexpected port');
    test.done();
  },
  testWebRoot : function(test){
    var serverSpy = startMockServer().serverSpy;
    test.ok(serverSpy.calledOnce, 'new server never created');
    test.equal('.', serverSpy.firstCall.args[0], 'Unexpected web root');
    test.done();
  },
  testServeIndex : function(test){
    var spies = startMockServer();
    var req = {url: '/'};
    var res = {};
    spies.serverCallback(req, res);
    test.ok(spies.serveFileSpy.calledOnce, 'index.html never served');
    test.ok(!spies.serveSpy.called, 'serve should not have been called');
    test.deepEqual(['/index.html', 200, {}, req, res], spies.serveFileSpy.firstCall.args, 'Unexpected call');
    test.done();
  },
  testServeOther : function(test){
    var spies = startMockServer();
    var req = {url: '/other.html'};
    var res = {};
    spies.serverCallback(req, res);
    test.ok(spies.serveSpy.calledOnce, 'other.html never served');
    test.ok(!spies.serveFileSpy.called, 'serveFile should not have been called');
    test.deepEqual([req, res], spies.serveSpy.firstCall.args, 'Unexpected call');
    test.done();
  },
  tearDown: function (callback) {
    process.argv = originalArgv;
    callback();
  }
};

function startMockServer(argv) {
  if (argv) {
    process.argv = argv;
  }
  var listenSpy = sinon.spy();
  var serverSpy = sinon.spy();
  var serveFileSpy = sinon.stub();
  serveFileSpy.returns({
    addListener : function() {}
  });
  var serveSpy = sinon.stub();
  serveSpy.returns({
    addListener : function() {}
  });
  var serverCallback;

  proxyquire('../src/start-server', {
    'node-static' : {
      Server : function(arg) {
        serverSpy(arg);
        this.serve = serveSpy;
        this.serveFile = serveFileSpy;

      }
    },
    http: {
      createServer : function(callback) {
        serverCallback = callback;
        return {
          listen : listenSpy
        };
      }
    }
  });
  return {
    listenSpy : listenSpy, 
    serverSpy: serverSpy,
    serveFileSpy: serveFileSpy,
    serveSpy: serveSpy,
    serverCallback: serverCallback
  };
}
