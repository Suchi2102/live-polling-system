import { io } from 'socket.io-client';

// This simple version tells the frontend to connect to the
// same server that it was loaded from. No full URL is needed.
const socket = io({
  autoConnect: false
});

export default socket;