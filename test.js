var assert = require("assert")

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
	});

	it('should set options from initialisation', function(){
		var ops = { per: 10, rest: 100 };
		var q = new fq( ops );
		assert.equal(ops.per, q.options.per);
		assert.equal(ops.rest, q.options.rest);
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

});

