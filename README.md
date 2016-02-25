# Hi

So the idea here is just that you might want to authorize a client to use your api with a key,
 .... lets say for now that the api key gets expired when the client logs out.
Maybe now you have a backend that wants to know who is currently logged in,
so they can then emit messages to all of the "logged in" web sockets. That is
what this code does.

This example isn't something anyone should user for real,
but maybe it gets the idea across.

* clone it
* `npm install`
* `node index`

Imagined using node v5.5

cheers.
