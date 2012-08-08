faqueue
=======

A fully asynchronous queue. Stop the browser locking up when processing long arrays. 

Asynchronously evaluate the queue while modifying it. Like $.lazyEach but you can add items to it anytime. 

Example
-------

A queue that calculates and outputs square roots, 3 per batch, with a 100ms delay between each batch.

    var options = {
      each: function(done){ console.log( Math.sqrt(this) ); done() },
      perBatch:  3,
      restTime: 100
    };

    var q = faqueue(options).add([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);


Options
-------

__each__

function to process each queue item

__perBatch__

how many queue items to process in each batch

__restTime__

how long to rest in milliseconds between batches



Methods
-------

__.add( array )__

Add to the queue

__.reset()__

Clear the queue and reset statistics

__.clear()__

Clear the queue but continue to wait for new items

__.pause()__

Pause processing

__.resume()__

Resume processing

__.on('eventname', function(){})__

Subscribe to events

__.getStats()__

Returns an object with add, each and batch counts.


Events
------

add

reset

batch

rest

clear

wait

pause

resume






Todo
----

__.sort( function(a, b){} )__
Sort the queue with function.

__workers__

__timeout__


Dependencies
------------

underscore.js



