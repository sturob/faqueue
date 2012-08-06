(function(){

	var _ = require('underscore');

	var fq = function(options){
	  this.options = _.defaults(options||{}, {
			each: function() {},
			per:    25, rest:    100,
			workers: 1, timeout: null
	  });

	  this.running = false;
	  this.queue = [];
	};

	fq.prototype.length = function(){ 
		return this.queue.length;
	};

	fq.prototype.add = function(arr) {
		this.queue = this.queue.concat( arr );
		return this;
	};

	fq.prototype.clear = function() {
		this.queue = [];
		return this;
	};

	fq.prototype.oneBatch = function(){
		if (this.length() > 0) {
			var queueHead = this.queue.splice(0, this.options.per);
			var that = this;

			_(queueHead).each(
				this.options.each
			);
			_.delay( function(){ that.oneBatch() }, that.options.rest);
		}
	};

	fq.prototype.start = function() {
		this.running = true;

		this.oneBatch();
		return this;
	};

	if (typeof window != 'undefined') { // browser
		window.faqueue = new fq;
	}	else {
		module.exports = fq;	
	}
})();