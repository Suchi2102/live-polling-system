import { useState, useEffect } from 'react';
import socket from '../socket';
import '../App.css';
import ResultsDisplay from '../components/ResultsDisplay';

function TeacherPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState('');
  const [results, setResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    socket.connect();
    function onPollResults(resultsData) {
      setResults(resultsData);
    }
    socket.on('poll_results', onPollResults);
    return () => {
      socket.disconnect();
      socket.off('poll_results', onPollResults);
    };
  }, []);

  const handleCreatePoll = () => {
    if (question.trim() && options.trim()) {
      const optionsArray = options.split(',').map(option => option.trim());
      if (optionsArray.length < 2) { alert("Please provide at least two options."); return; }
      const pollData = { question, options: optionsArray };
      socket.emit('create_poll', pollData);
      setCurrentQuestion(question);
      setResults(null);
      setQuestion('');
      setOptions('');
    } else {
      alert("Please fill in the question and options.");
    }
  };
  
  const handleNewPoll = () => {
    setResults(null);
    setCurrentQuestion('');
  }

  if (results) {
    return (
      <div className="app-container">
        <ResultsDisplay question={currentQuestion} results={results} />
        <button onClick={handleNewPoll} className="ask-new-button">Ask a New Question</button>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <div className="teacher-screen">
        <h1>Create a New Poll 📝</h1>
        <label htmlFor="question">Question:</label>
        <input id="question" type="text" placeholder="e.g., What is your favorite color?" value={question} onChange={(e) => setQuestion(e.target.value)} />
        <label htmlFor="options">Options:</label>
        <input id="options" type="text" placeholder="Enter options, separated by commas" value={options} onChange={(e) => setOptions(e.target.value)} />
        <button onClick={handleCreatePoll}>Ask Question</button>
      </div>
    </div>
  );
}
export default TeacherPage;