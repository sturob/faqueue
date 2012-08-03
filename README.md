faqueue
=======

A fully asynchronous queue. Stop the browser locking up. Lazily evaluate and modify a queue. Easily process long lists asynchronously.




Like a $.lazyEach that you can add more items to. 


    var q = faqueue();
    q.each( function(item, callback){ insert(this); callback(); } )
     .add( item )
     .perTick( 10 )
     .breakTime( 100 )
    // .concurrent(1) 

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

