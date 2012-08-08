faqueue
=======

A fully asynchronous queue. Stop the browser locking up when processing long arrays. 

Asynchronously evaluate an array while modifying it. Like $.lazyEach but you can add items to it anytime. 

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



