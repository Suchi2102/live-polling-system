import { io } from 'socket.io-client';

// Connect to the backend server running on port 3001
const socket = io('http://localhost:3001', {
  autoConnect: false
});

export default socket;