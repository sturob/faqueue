var assert = require("assert");
var _ = require('underscore');

var fq = require('./faqueue');

describe('faqueue', function(){
	it('should set some default options', function(){
		var q = fq().pause();
		assert.ok( q.options.per );
		assert.ok( q.options.rest );
		assert.ok( q.options.each );
	});

	it('should set options from initialisation', function(){
		var ops = { per: 10, rest: 100, each: function(){ return false } };
		var q = fq( ops );
		assert.equal( ops.per,  q.options.per  );
		assert.equal( ops.rest, q.options.rest );
		assert.equal( ops.each, q.options.each );
	});

	it('#length() should return the queue length', function(){
		var q = fq();
		assert.equal( q.length(), 0 );
	});

	describe('#add()', function(){
		it('should add elements to the queue', function() {
			var q = fq().pause();
			q.add([1,2,3]);
			assert.equal(q.length(), 3);
			q.add([4,5,6]);
			assert.equal(q.length(), 6);
		});

		it('should add elements while queue is processing', function(callback) {
			var q = fq({ each: function() { result.push(this) }, per: 1, rest: 100 }),
					result = [];

//			q.on('all',function(ev){ console.log(ev); console.log(this.counts) })
			q.on('wait', function(){
				if (_.isEqual([1, 2, 3, 4, 5, 6], result)) callback();
			}).add([1,2,3]).start();

			q.add([4,5,6]);
		});



		it('should process added elements if queue is done processing', function(callback) {
			var q = fq({ each: function() { result.push(this) } }),
					result = [];

			q.on('wait', function(){
				if (_.isEqual([1, 2, 3, 4, 5, 6], result)) callback();
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
		it('should automatically start processing the queue', function(callback) {
			var arr = [ 1, 2, 3, 4, 5 ]; 
			var five = _.after(arr.length, function(){ callback() })
			var q = fq({ each: five, rest: 100, per: 1 });
			q.add(arr);
		});

		it('should trigger start and wait events', function(callback) {
			var q = fq({rest: 10, per: 1 }),
					n = 0,
					inc = function() { n++ };

			q.on('start', inc).on('wait', function () {
				if (n == 1) { callback() }
			}).start();
		});

		it('should be able to calculate some results', function(callback) {
			var input   = [ 1, 2, 3, 4,  5 ],
					desired = [ 2, 4, 6, 8, 10 ],
					output  = [],
					done = function() {
						if (_.isEqual(desired, output)) callback();
					};
			var each = function(item, callback){
				output.push(this * 2);
			};
			fq({ each: each, rest: 10, per: 1 })
				.add(input).on('wait', done).start();
		});

		it('should correctly handle the per option', function(callback) {
			var q 	= fq({rest: 0, per: 2 }),
					wait = function () { if (q.getStats().batch == 5) callback() },
					arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

			q.on('wait', wait).add(arr);
		});
	});



	describe('#pause()', function(){
		it('should work even when called in a chain after add', function(ok) {
			var q = fq().add([1,2,3,4,5,6]).pause();

			_.delay(function(){
				if (q.getStats().each == 0) ok()
			}, 500)
		})
	});
	
	describe('#resume()', function(){
		it('should unpause processing', function(ok) {
			var now_a = Date.now(),
					q = fq({rest: 1, per: 10 }),
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



});

