import { io } from 'socket.io-client';

// The URL of our backend server
const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Create the socket instance
const socket = io(URL, {
  autoConnect: false // We will connect manually when needed
});

export default socket;