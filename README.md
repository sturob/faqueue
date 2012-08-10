faqueue.js
==========

Fully asynchronous queues. Stop the browser locking up when processing long arrays. 

Asynchronously evaluate an array while modifying it. Like $.lazyEach but you can add items to it any time. 

Method chaining is supported.


Example
-------

A queue that calculates and outputs squares, 3 per batch, with a 20ms delay between each batch.

    var options = {
      each: function(){ console.log( this * this ) },
      perBatch:  3,
      restTime: 20
    };

    var q = faqueue(options).add([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
    
=> 1, 4, 9 ... 16, 25, 36 ... 49, 64, 81 ... 100

Time passes
    
    q.add([ 11, 12, 13, 14 ])
    
=>  121, 144, 169 ... 196




Methods
-------

### Instantiate

    var q = faqueue(options);

Create a new faqueue object configured with the __options__ hash.


### options
	
    q.options( options )

Possible keys in the __options__ hash are:

* each: A callback to be run on each queue item (default: function(){})
* perBatch: How many queue items to process in each batch (default: 25).
* restTime: How long to rest in milliseconds between batches (default: 10).


### add

    q.add( array )

Add __array__ to the end of queue __q__.


### reset

	q.reset()

Clear queue __q__ and reset statistics.


### clear
	
	q.clear()

Clear queue __q__ but continue to wait for new items.


### pause

    q.pause()

Pause processing of __q__.


### resume

    q.resume()

Resume processing of __q__.

### on

    q.on('event', callback)

Subscribe to events. For available events see events section.


### getStats

	var stats = q.getStats()

Return an hash with add, each and batch counts.


Special properties of the _each_ callback
-----------------------------------------

Inside the function *this* will be the current queue item. 

If the function definition receives a parameter, the function is expected to run the callback to indicate it has finished.

If the function returns a callback, that callback is called to cancel any pending processing if .cancel() is called.


Events
------

Method events (add, reset, clear, pause, resume) are fired when those methods are called.

Internal events are more useful:

* batch: a batch is about to be processed

* rest: started resting between batches

* wait: the queue has been emptied by processing


Todo
----

__.sort( function(a, b){} )__

Sort the queue with function.

__workers__

__timeout__


Dependencies
------------

underscore.js



