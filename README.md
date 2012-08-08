faqueue.js
==========

A fully asynchronous queue. Stop the browser locking up when processing long arrays. 

Asynchronously evaluate an array while modifying it. Like $.lazyEach but you can add items to it anytime. 

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


Options
-------

Passed in on initialisation.

__each__
A function to process each queue item. *this* will be the queue item.

__perBatch__
How many queue items to process in each batch.

__restTime__
How long to rest in milliseconds between batches.



Methods
-------

__.add( array )__

Add an array to the end of the queue.

__.reset()__

Clear the queue and reset statistics.

__.clear()__

Clear the queue but continue to wait for new items.

__.pause()__

Pause processing.

__.resume()__

Resume processing.

__.on('eventname', function(){})__

Subscribe to events.

__.getStats()__

Return an object with add, each and batch counts.


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



