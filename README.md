faqueue
=======

A fully asynchronous queue. Stop the browser locking up. Lazily evaluate and simultaneously modify a queue. Easily process long lists asynchronously.

Like a $.lazyEach that you can add more items to. 

Example
-------

A queue that calculates and outputs square roots, 3 per batch, with a 100ms delay between each batch.

     
    var q = Faqueue({
      each: function(item, callback){ console.log( Math.sqrt(this) ); callback(); },
      per: 3,
      rest: 100
    });
    q.add([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);


Methods
-------

*.add( array )*
Add to the queue

*.start()*
Start processing. Automatically called on creation

*.cancel()*
Cancel current processing and clear the queue

*.clear()*
Clear the queue but continue to wait for new items

*.pause()*
Pause processing

*.on('complete', function(){})*
'break' 'add' 'pause' etc..

*.sort( function(a, b){} )*
Sort the queue with function.


Options
-------

each

per

rest

workers

timeout

Dependencies
------------

underscore.js



