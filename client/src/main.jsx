import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// entry point of the application
// renders the root react component into the html dom
ReactDOM.createRoot(document.getElementById('root')).render(

  // strict mode helps identify potential problems during development
  <React.StrictMode>

    // main app component
    <App />

  </React.StrictMode>
)