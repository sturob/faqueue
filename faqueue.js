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
	};

//	window.faqueue = new fq;
	module.exports = fq;
})();
