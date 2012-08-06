faqueue
=======

A fully asynchronous queue. Stop the browser locking up. Lazily evaluate and simultaneously modify a queue. Easily process long lists asynchronously.

Like a $.lazyEach that you can add more items to. 

Example
-------

Create a queue that outputs items, 3 items per tick, with a 100ms delay between ticks.

     
    var q = Faqueue({
      each: function(item, callback){ console.log(this); callback(); },
      add:  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
      do: 3,
      rest: 100
    })


.cancel()
Cancel current processing and clear the queue

.clear()
Clear the queue but continue to wait for new items

.pause()
Pause processing

.start()
Start processing. Automatically called on creation

.sort( function(a, b){} )
Sort the queue with function.

.on('complete', function(){})
'break' 'add' 'pause' etc..


// options

add
each
do
rest
workers
