import React from 'react';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Home from './pages/Home.js';
import UploadManifest from './pages/UploadManifest.js';
import TaskSelection from './pages/TaskSelection.js';

// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element ={<Home />}></Route>
        <Route path = "/upload-manifest" element ={<UploadManifest />}></Route>
        <Route path = "/task-selection" element ={<TaskSelection />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
