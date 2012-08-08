var assert = require("assert");
var _ = require('underscore');

var fq = require('./faqueue');


describe('faqueue', function(){
  it('should set some default options', function(){
    var q = fq().pause();
    assert.ok( q.options.perBatch );
    assert.ok( q.options.restTime );
    assert.ok( q.options.each );
  });

  it('should set options from initialisation', function(){
    var ops = { perBatch: 10, restTime: 100, each: function(){ return false } };
    var q = fq( ops );
    assert.equal( ops.perBatch,  q.options.perBatch  );
    assert.equal( ops.restTime,  q.options.restTime );
    assert.equal( ops.each,      q.options.each );
  });

  it('#length() should return the queue length', function(){
    assert.equal( fq().length(), 0 );
    assert.equal( fq().add([1,2,3]).pause().length(), 3 );
  });

  describe('#add()', function(){
    it('should add elements to the queue', function() {
      var q = fq().pause();
      q.add([1,2,3]);
      assert.equal(q.length(), 3);
      q.add([4,5,6]);
      assert.equal(q.length(), 6);
    });

    it('should add elements while queue is processing', function(ok) {
      var q = fq({ each: function() { result.push(this) }, perBatch: 1, restTime: 100 }),
          result = [];

      q.on('wait', function(){
        if (_.isEqual([1, 2, 3, 4, 5, 6], result)) ok();
      }).add([1,2,3]).start();

      q.add([4,5,6]);
    });



    it('should process added elements if queue is done processing', function(ok) {
      var q = fq({ each: function() { result.push(this) } }),
          result = [];

      q.on('wait', function(){
        if (_.isEqual([1, 2, 3, 4, 5, 6], result)) ok();
      }).add([1,2,3]).start();

      _.delay(function() { q.add([4,5,6]).resume() }, 300);
    });

  });

  describe('#clear()', function(){
    it('should empty the queue', function() {
      var q = fq().pause();
      q.add([1,2,3]);
      assert.equal(q.length(), 3);
      q.clear();
      assert.equal(q.length(), 0);
    })
  });

  describe('#start()', function(){
    it('should automatically start processing the queue', function(ok) {
      var arr = [ 1, 2, 3, 4, 5 ]; 
      var five = _.after(arr.length, function(){ ok() })
      var q = fq({ each: five, restTime: 100, perBatch: 1 });
      q.add(arr);
    });

    it('should trigger start and wait events', function(ok) {
      var q = fq({restTime: 10, perBatch: 1 }),
          n = 0,
          inc = function() { n++ };

      q.on('start', inc).on('wait', function () {
        if (n == 1) { ok() }
      }).start();
    });

    it('should be able to calculate some results', function(ok) {
      var input   = [ 1, 2, 3, 4,  5 ],
          desired = [ 2, 4, 6, 8, 10 ],
          output  = [],
          done = function() {
            if (_.isEqual(desired, output)) ok();
          };
      var each = function(item, ok){
        output.push(this * 2);
      };
      fq({ each: each, restTime: 10, perBatch: 1 })
        .add(input).on('wait', done).start();
    });

    it('should correctly handle the perBatch option', function(ok) {
      var q   = fq({restTime: 0, perBatch: 2 }),
          wait = function () { if (q.getStats().batch == 5) ok() },
          arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

      q.on('wait', wait).add(arr);
    });
  });



  describe('#pause()', function(){
    it('should work even when called in a chain after add', function(ok) {
      var q = fq().add([1,2,3,4,5,6]).pause();

      _.delay(function(){
        if (q.getStats().each == 0) ok()
      }, 500);
    })
  });
  
  describe('#resume()', function(){
    it('should unpause processing', function(ok) {
      var now_a = Date.now(),
          q = fq({restTime: 1, perBatch: 10 }),
          wait = function () {
            var now_b = Date.now();
            if (q.getStats().each == 8 && (now_b - now_a) > 1000) ok();
          };
      q.on('wait', wait).add( "12345678".split('') ).pause();

      _.delay(function(){
        q.resume();
      }, 1000);
    });
  });


  describe('#clear()', function() {
    it('should clear the queue but leave it running', function(ok) {
      var q = fq({ restTime: 100, perBatch: 1 });
      q.add( "1234567890".split('') ).on('wait', function(){
        var stats = q.getStats();
        if (stats.each >= 8 && q.length() == 0) ok();
      });

      _.delay(function(){ q.clear() }, 500);
      _.delay(function(){ q.add([1, 2, 3]) }, 600); 
    });
  });

  describe('#reset()', function() {
    it('should clear and reset the queue', function(ok) {
      var q = fq({ restTime: 100, perBatch: 1 });
      q.add( "1234567890".split('') ).on('reset', function(){
        var stats = q.getStats();
        if (stats.each == 0 && q.length() == 0) ok();
      });

      _.delay(function(){ q.reset() }, 500);
    });
  });


  //describe('each should work asyncronously with a callback once completed');

});

