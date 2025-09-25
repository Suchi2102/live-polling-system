const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://glistening-dolphin-9ed2a7.netlify.app", 
    methods: ["GET", "POST"]
  }
});

let currentPoll = null;
let pollResults = {};
let studentCount = 0;
let votesReceived = 0;
let pollTimer = null; // Variable to hold our timer

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('create_poll', (pollData) => {
    // 1. Clear any previous timer
    if (pollTimer) {
      clearTimeout(pollTimer);
    }
    
    // 2. Set up the new poll
    currentPoll = pollData;
    pollResults = {};
    votesReceived = 0;
    currentPoll.options.forEach(option => {
      pollResults[option] = 0;
    });
    
    // 3. Determine number of voters (all connected clients minus the teacher)
    studentCount = io.engine.clientsCount - 1;
    
    // 4. Add the timer duration to the poll data
    const pollWithDuration = { ...currentPoll, duration: 60 };
    io.emit('new_poll', pollWithDuration); // Send poll with duration to everyone
    
    console.log(`Poll created. 60-second timer started for ${studentCount} student(s).`);

    // 5. Start the 60-second timer
    pollTimer = setTimeout(() => {
      console.log('Timer expired! Broadcasting results.');
      io.emit('poll_results', pollResults);
    }, 60000); // 60,000 milliseconds = 60 seconds
  });

  socket.on('submit_answer', (data) => {
    const { answer } = data;
    if (currentPoll && pollResults.hasOwnProperty(answer)) {
      pollResults[answer]++;
      votesReceived++;
      console.log(`Vote received. Total votes: ${votesReceived}/${studentCount}`);
      
      // If everyone votes, cancel the timer and send results early
      if (votesReceived === studentCount) {
        clearTimeout(pollTimer);
        console.log('All votes received! Broadcasting results.');
        io.emit('poll_results', pollResults);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});