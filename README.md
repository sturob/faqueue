faqueue
=======

A fully asynchronous queue. Stop the browser locking up. Lazily evaluate and simultaneously modify a queue. Easily process long lists asynchronously.

Like a $.lazyEach that you can add more items to. 

Example
-------

A queue that calculates and outputs square roots, 3 per batch, with a 100ms delay between each batch.

    var options = {
      each: function(done){ console.log( Math.sqrt(this) ); done() },
      per:  3,
      rest: 100
    };

    var q = faqueue(options).add([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);


Methods
-------

__.add( array )__
Add to the queue

__.cancel()__
Cancel current processing and clear the queue

__.clear()__
Clear the queue but continue to wait for new items

__.pause()__
Pause processing

__.resume()__
Resume processing

__.on('wait', function(){})__
'break' 'add' 'pause' etc..



Options
-------

__each__

function to process each queue item

__per__

how many queue items to process in each batch

__rest__

how long to rest in milliseconds between batches


Todo
----

__.sort( function(a, b){} )__
Sort the queue with function.

__workers__

__timeout__


Dependencies
------------

underscore.js



