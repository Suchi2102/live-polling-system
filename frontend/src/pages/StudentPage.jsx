import { useState, useEffect } from 'react';
import socket from '../socket';
import '../App.css';
import ResultsDisplay from '../components/ResultsDisplay';

function StudentPage() {
  const [name, setName] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // <-- New state for the timer

  // This new useEffect handles the countdown logic
  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(null); // Reset timer when it hits 0
      return;
    }
    if (!timeLeft) return; // Do nothing if there's no timer
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId); // Cleanup the interval
  }, [timeLeft]);

  useEffect(() => {
    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }
    function onNewPoll(pollData) {
      setResults(null);
      setHasVoted(false);
      setPoll(pollData);
      setTimeLeft(pollData.duration); // <-- Start the timer
    }
    function onPollResults(resultsData) {
      setResults(resultsData);
      setPoll(null); // Clear the poll to be ready for the next one
      setTimeLeft(null); // Clear the timer
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_poll', onNewPoll);
    socket.on('poll_results', onPollResults);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_poll', onNewPoll);
      socket.off('poll_results', onPollResults);
    };
  }, []);

  const handleJoin = () => { if (name.trim()) { socket.auth = { username: name }; socket.connect(); } else { alert("Please enter your name!"); } };
  const handleVote = (option) => { socket.emit('submit_answer', { answer: option }); setHasVoted(true); };

  // --- RENDER LOGIC (mostly unchanged, just added the timer display) ---

  if (results) {
    return <div className="app-container"><ResultsDisplay question={results.question || poll?.question} results={results.results || results} /></div>;
  }
  if (!isConnected) {
    return ( <div className="app-container"><div className="join-screen"><h2>Join Live Poll</h2><input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} /><button onClick={handleJoin}>Join</button></div></div> );
  }
  if (!poll) {
    return ( <div className="app-container"><h2>Welcome, {socket.auth?.username}! 👋</h2><p>You are connected. Please wait for the teacher to start the poll.</p></div> );
  }
  if (hasVoted) {
    return ( <div className="app-container"><h2>Thank you for voting!</h2><p>Waiting for the results...</p></div> );
  }
  return (
    <div className="app-container">
      <div className="poll-container">
        <div className="timer">Time Left: {timeLeft}s</div>
        <h2>{poll.question}</h2>
        <div className="options-container">
          {poll.options.map((option, index) => (
            <button key={index} className="option-button" onClick={() => handleVote(option)}>{option}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
export default StudentPage;