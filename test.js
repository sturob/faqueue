var assert = require("assert");
var _ = require('underscore');

var fq = require('./faqueue');


describe('faqueue', function(){

  describe('options:', function () {
    it('should have defaults', function(){
      var q = fq().pause();
      assert.ok( q._options.perBatch );
      assert.ok( q._options.restTime );
      assert.ok( q._options.each );
    });

    it('should be set from initialisation', function(){
      var ops = { perBatch: 10, restTime: 100, each: function(){ return false } },
          q   = fq( ops );
      assert.equal( ops.perBatch,  q._options.perBatch  );
      assert.equal( ops.restTime,  q._options.restTime );
      assert.equal( ops.each,      q._options.each );
    });


    it('can be set with options()', function(){
      var ops = { perBatch: 10, restTime: 100, each: function(){ return false } },
          q   = fq().options(ops);
      assert.equal( ops.perBatch,  q._options.perBatch  );
      assert.equal( ops.restTime,  q._options.restTime );
      assert.equal( ops.each,      q._options.each );
    });
    
    it("'each' should work syncronously without a callback", function (ok) {
      fq({
        restTime: 0, perBatch: 1, 
        each: function(){ }
      }).add([1,2,3]).on('wait', function(){
        if (this.getStats().each == 3) ok()
      })
    });

    it("'each' should work asyncronously with a callback once complete", function (ok) {
      fq({
        restTime: 0, perBatch: 1, 
        each: function(done){ setTimeout(done, 100) }
      }).add([1,2,3]).on('wait', function(){
        if (this.getStats().each == 3) ok()
      })
    });
  
    it("if 'each' returns a function, call that function on .cancel()", function (ok) {
      var stayfalse = false;
      fq({
        restTime: 0, perBatch: 1, 
        each: function(){
          console.log('added ' + this)
          var timeId = setTimeout(
                          function(){
                                    console.log(stayfalse)

                            stayfalse = true;
                          }, 1000);

          return function(){ clearTimeout(timeId) }
        }
      }).add([1,2,3]).on('cancel', function(){
        if (! stayfalse) ok();
      }).cancel();
    });


    it("'restTime' should cause resting between batches")

    it("'perBatch' should cause N processing per batches")

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
      }).add([1,2,3]);

      q.add([4,5,6]);
    });

    it('should process added elements if queue is done processing', function(ok) {
      var q = fq({ each: function() { result.push(this) } }),
          result = [];

      q.on('wait', function(){
        if (_.isEqual([1, 2, 3, 4, 5, 6], result)) ok();
      }).add([1,2,3]);

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
    it('should be called automatically', function(ok) {
      var arr = [ 1, 2, 3, 4, 5 ]; 
      var five = _.after(arr.length, function(){ ok() })
      fq({ each: five, restTime: 100, perBatch: 1 }).add(arr);
    });

    it('should trigger start and wait events', function(ok) {
      var q   = fq({restTime: 10, perBatch: 1 }),
          n   = 0,
          inc = function() { n++ };

      q.on('start', inc).on('wait', function () {
        if (n == 1) { ok() }
      }).add([]);
    });

    it('should be able to calculate some results', function(ok) {
      var input   = [ 1, 2, 3, 4,  5 ],
          desired = [ 2, 4, 6, 8, 10 ],
          output  = [],
          done = function() {
            if (_.isEqual(desired, output)) ok();
          };
      var each = function(yup){
        output.push(this * 2);
        yup();
      };
      fq({ each: each, restTime: 10, perBatch: 1 })
        .add(input).on('wait', done);
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
      }, 100);
    })
  });
  
  describe('#resume()', function(){
    it('should unpause processing', function(ok) {
      var now_a = Date.now(),
          q = fq({ restTime: 1, perBatch: 10 }),
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




});

