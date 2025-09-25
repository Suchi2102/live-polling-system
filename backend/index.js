const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path"); // <-- Add this line

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

// --- Serve the frontend files ---
const frontendBuildPath = path.join(__dirname, "..", "frontend", "dist");

// Serve all static files from the 'dist' directory
app.use(express.static(frontendBuildPath));

// For all other requests, serve the 'index.html' file
// For all other requests, serve the 'index.html' file
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});
// ---------------------------------
// ---------------------------------------------

// ... The rest of your index.js file is exactly the same ...
let currentPoll = null;
let pollResults = {};
let studentCount = 0;
let votesReceived = 0;
let pollTimer = null;

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.on("create_poll", (pollData) => {
    if (pollTimer) clearTimeout(pollTimer);
    currentPoll = pollData;
    pollResults = {};
    votesReceived = 0;
    currentPoll.options.forEach((option) => {
      pollResults[option] = 0;
    });
    studentCount = io.engine.clientsCount - 1;
    const pollWithDuration = { ...currentPoll, duration: 60 };
    io.emit("new_poll", pollWithDuration);
    console.log(
      `Poll created. 60-second timer started for ${studentCount} student(s).`,
    );
    pollTimer = setTimeout(() => {
      console.log("Timer expired! Broadcasting results.");
      io.emit("poll_results", pollResults);
    }, 60000);
  });
  socket.on("submit_answer", (data) => {
    const { answer } = data;
    if (currentPoll && pollResults.hasOwnProperty(answer)) {
      pollResults[answer]++;
      votesReceived++;
      console.log(
        `Vote received. Total votes: ${votesReceived}/${studentCount}`,
      );
      if (votesReceived === studentCount) {
        clearTimeout(pollTimer);
        console.log("All votes received! Broadcasting results.");
        io.emit("poll_results", pollResults);
      }
    }
  });
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
