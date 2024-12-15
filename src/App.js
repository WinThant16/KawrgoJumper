import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import UploadManifest from './pages/UploadManifest.js';
import TaskSelection from './pages/TaskSelection.js';
import LoadContainers from './pages/LoadContainers.js';
import Balance from './pages/Balance.jsx';
import SelectContainers from './pages/SelectContainers.jsx';
// import MoveContainers from './pages/MoveContainersPage.js'; // Import MoveContainersUnload
import MoveContainersUnload from './pages/MoveContainersUnload.jsx'; // Import the new page
import MoveContainersLoad from './pages/MoveContainersLoad.jsx'; // Import the new page
import Summary from './pages/Summary.js'
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload-manifest" element={<UploadManifest />} />
        <Route path="/task-selection" element={<TaskSelection />} />
        <Route path="/select-containers" element={<SelectContainers />} />
        <Route path="/load-containers" element={<LoadContainers />} />
        <Route path="/balance" element={<Balance />} />
        {/* <Route path="/move-containers" element={<MoveContainers />} /> Add MoveContainersUnload route */}
        <Route path="/move-containers-unload" element={<MoveContainersUnload />} /> {/* New Route */}
        <Route path="/move-containers-load" element={<MoveContainersLoad />} /> {/* New Route */}
        <Route path="/summary" element={<Summary />} /> {/* New Route */}
      </Routes>
    </Router>
  );
}

export default App;
