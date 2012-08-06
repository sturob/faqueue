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



describe('Faqueue', function(){
	var q = new fq();
	it('length() should return the queue length', function(){
		assert.equal(q.length(), 0);
	})
});

