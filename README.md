faqueue.js
==========

Fully asynchronous queues. Stop the browser locking up when processing long arrays. 

Asynchronously evaluate an array while modifying it. Like $.lazyEach but you can add items to it at any time. 

Method chaining is supported.


Example
-------

A queue that calculates and outputs squares, 3 per batch, with a 20ms delay between each batch.

    var options = {
      perBatch:  3,
      restTime: 20
    };

    var q = faqueue(options).each(function(){ console.log( this * this ) });
    q.add([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
    
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

Set options at any time.
    
    q.options( options )

Possible keys in the __options__ hash are:

* perBatch: How many queue items to process in each batch (default: 25).
* restTime: How long to rest in milliseconds between batches (default: 10).


### each

Set the function to be run on each queue item.

    q.each( function(){ console.log(this) } )

See 'Special properties of the _each_ callback' for more details.


### add

Add __array__ to the end of the queue.

    q.add( array )




### reset

Clear queue and reset statistics.

	q.reset()




### clear

Clear queue but continue to wait for new items.

    q.clear()




### pause

Pause processing of the queue.

    q.pause()




### resume

Resume processing of the queue.

    q.resume()



### on

Subscribe to various events that the queue emits. See events section for event names.

    q.on('event', callback)




### getStats

Return an hash with add, each and batch counts.

    var stats = q.getStats()




Special properties of the _each_ callback
-----------------------------------------

Inside the callback, *this* is the current queue item. 

faqueue detects if the _each callback_ receives a parameter, this parameter is a function that should be called to indicate processing is complete.

    faqueue().each( function(done){
      setTimeout(function(){ 
        console.log('relax x' + this);
    	done();
      }, 10000);
    }).add([1, 2, 3]);

The _each callback_ can return a cancel function. The cancel function will be used to clean up processing if .cancel() is called.

    faqueue().each( function(){
      var id = setTimeout(function(){ 
                 console.log('waiting around to see if I can be cancelled') 
               }, 10000);
      return function(){ clearTimeout( id ) };
    }).add([1, 2, 3]);
    

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



