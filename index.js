
"use strict"
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const jsonBodyParser = require('body-parser').json();

const inMemoryUsers = {}; // { id : socket }
const authTokens = {};

const keyThatWeGiveEveryoneBecauseWeDontDoSecurity = 'one key to rule them all';

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

var keyCounter = 0; // just to make keys distinct
app.get('/pretend-login', (req, res) => {
    let newKey = `${keyThatWeGiveEveryoneBecauseWeDontDoSecurity}-${keyCounter}`;
    authTokens[newKey] = true; // no hashsets in js :|
    res.json({authToken: newKey});
});

app.post('/broadcast', jsonBodyParser, (req, res) => {
    console.log(req.body);
    res.status(200);
    res.end()
})

io.on('connection', (socket) => {
  console.log(`a user connected with socketId=${socket.id}`);
  socket.emit('hello', { id: socket.id });
  socket.on('verify', (data) => {
    console.log(`verifying user bearing token: ${data.token}`);
    if (!authTokens[data.token]) {
      console.log('user failed to log in')
      socket.emit('verify', 'that auth token is bullshit');
    } else {
      inMemoryUsers[data.token] = socket;
      console.log('associated user auth token with socket,' +
      ' emitting that they have logged in to other logged in users (including themselves)');
      Object.keys(inMemoryUsers).forEach(token => 
        inMemoryUsers[token].emit('joined', `welcome user on socket ${socket.id}`))  
    }
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});