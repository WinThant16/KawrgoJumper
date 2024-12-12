import React from 'react';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import Home from './pages/Home.js';
import UploadManifest from './pages/UploadManifest.js';
import TaskSelection from './pages/TaskSelection.js';
import SelectContainers from './pages/SelectContainers.jsx';
import Balance from './pages/Balance.jsx';

// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element ={<Home />}></Route>
        <Route path = "/upload-manifest" element ={<UploadManifest />}></Route>
        <Route path = "/task-selection" element ={<TaskSelection />}></Route>
        <Route path = "/select-containers" element ={<SelectContainers />}></Route>
        <Route path = "/balance" element ={<Balance />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
