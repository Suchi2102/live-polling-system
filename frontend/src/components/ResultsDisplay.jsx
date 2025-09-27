import React from 'react';
import '../App.css';

function ResultsDisplay({ question, results }) {
  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="poll-container">
      <h2>{question}</h2>
      <div className="results-list">
        {Object.entries(results).map(([option, votes]) => {
          const percentage = totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(0);
          return (
            <div key={option} className="result-item">
              <div className="result-info">
                <strong>{option}</strong>
                <span>{votes} vote(s)</span>
              </div>
              <div className="result-bar-background">
                <div className="result-bar-foreground" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="result-percentage">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResultsDisplay;