(function(){

	var _ = require('underscore');

	var fq = function(options){
	  this.options = _.defaults(options||{}, {
			each: function() {},
			per:    25, rest:    100,
			workers: 1, timeout: null
	  });

	  this.queue = [];

		this.length = function(){ 
			return this.queue.length
		};

		this.add = function(arr) {
			this.queue = this.queue.concat( arr );
		};

		this.clear = function() {
			this.queue = [];
		}
	};

	if (typeof window != 'undefined') { // browser
		window.faqueue = new fq;
	}	else {
		module.exports = fq;	
	}
})();