var assert = require("assert");
var _ = require('underscore');

var fq = require('./faqueue');

describe('faqueue', function(){
	it('should set some default options', function(){
		var q = fq();
		assert.ok(q.options.per);
		assert.ok(q.options.rest);
		assert.ok(q.options.each);
	});

	it('should set options from initialisation', function(){
		var ops = { per: 10, rest: 100, each: function(){return false} };
		var q = fq( ops );
		assert.equal(ops.per, q.options.per);
		assert.equal(ops.rest, q.options.rest);
		assert.equal(ops.each, q.options.each);
	});

	it('#length() should return the queue length', function(){
		var q = fq();
		assert.equal(q.length(), 0);
	});

	describe('#add()', function(){
		it('should add elements to the queue', function() {
			var q = fq();
			q.add([1,2,3]);
			assert.equal(q.length(), 3);
			q.add([4,5,6]);
			assert.equal(q.length(), 6);
		});

		it('should add elements while queue is processing', function(callback) {
			var q = fq({ each: function() { result.push(this) } }),
					result = [];

			q.on('finish', function(){
				if (_.isEqual([1, 2, 3, 4, 5, 6], result)) callback();
			}).add([1,2,3]).start();

			q.add([4,5,6]);
		});


		it('should add elements while queue is processing', function(callback) {
			var q = fq({ each: function() { result.push(this) } }),
					result = [];

			q.on('finish', function(){
				if (_.isEqual([1, 2, 3, 4, 5, 6], result)) callback();
			}).add([1,2,3]).start();

			q.add([4,5,6]);
		});

	});

	describe('#clear()', function(){
		it('should empty the queue', function() {
			var q = fq();
			q.add([1,2,3]);
			q.clear();
			assert.equal(q.length(), 0);
		})
	});
	
	describe('#start()', function(){
		it('should start processing the queue', function(callback) {
			var arr = [ 1, 2, 3, 4, 5 ]; 
			var five = _.after(arr.length, function(){ callback() })
			var q = fq({ each: five, rest: 100, per: 1 });
			q.add(arr).start();
		});

		it('should trigger start and finish events', function(callback) {
			var q = fq({rest: 10, per: 1 }),
					n = 0,
					inc = function() { n++ };

			q.on('start', inc).on('finish', function () {
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
			var q = fq({ each: each, rest: 10, per: 1 });
			q.add(input).on('finish', done).start();
		});

		it('should correctly handle the per option', function(callback) {
			var q 	= fq({rest: 0, per: 2 }),
					n 	= 0,
					inc = function() { n++ },
					finish = function () { if (n == 5) callback() },
					arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

			q.on('batch.start', inc).on('finish', finish).add(arr).start();
		});
	});



	describe('#pause() and #resume()', function(){
		it('should stop and restart processing', function(callback) {
			var now_a = Date.now(),
					q = fq({rest: 1, per: 10 }),
					finish = function () { 
						var now_b = Date.now();
						if ((now_b - now_a) > 1000) callback();
					};
			q.on('finish', finish).add( Array(8) ).start().pause();

			_.delay(function(){
				q.resume()
			}, 1000);
		});
	});


	// describe('')


});

