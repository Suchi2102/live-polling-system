import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Add this line

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- 2. Add the opening tag */}
      <App />
    </BrowserRouter> {/* <-- 3. Add the closing tag */}
  </React.StrictMode>,
)