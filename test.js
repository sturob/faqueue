var assert = require("assert");
var _ = require('underscore');

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});

var fq = require('./faqueue');

describe('faqueue', function(){
	it('should set some default options', function(){
		var q = new fq();
		assert.ok(q.options.per);
		assert.ok(q.options.rest);
		assert.ok(q.options.each);
	});

	it('should set options from initialisation', function(){
		var ops = { per: 10, rest: 100, each: function(){return false} };
		var q = new fq( ops );
		assert.equal(ops.per, q.options.per);
		assert.equal(ops.rest, q.options.rest);
		assert.equal(ops.each, q.options.each);
	});

	it('#length() should return the queue length', function(){
		var q = new fq();
		assert.equal(q.length(), 0);
	});

	describe('#add()', function(){
		it('should add elements to the queue', function() {
			var q = new fq();
			q.add([1,2,3]);
			assert.equal(q.length(), 3);
			q.add([4,5,6]);
			assert.equal(q.length(), 6);
		})
	});

	describe('#clear()', function(){
		it('should empty the queue', function() {
			var q = new fq();
			q.add([1,2,3]);
			q.clear();
			assert.equal(q.length(), 0);
		})
	});
	
	describe('#start()', function(){
		it('should start processing the queue', function(callback) {
			var arr = [ 1, 2, 3, 4, 5 ]; 
			var five = _.after(arr.length, function(){ callback() })
			var q = new fq({ each: five, rest: 100, per: 1 });
			q.add(arr).start();
		});

	});


	

// describe('User', function(){
//   describe('#save()', function(){
//     it('should save without error', function(done){
//       var user = new User('Luna');
//       user.save(function(err){
//         if (err) throw err;
//         done();
//       });
//     })
//   })
// })



});

