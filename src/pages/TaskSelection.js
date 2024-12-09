import React, { useState } from "react";
import "../styles/TaskSelection.css";
import Navbar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom";

function TaskSelection() {
  const navigate = useNavigate();
  localStorage.setItem('currentPage', 'task-selection');	
  // 0 or 1
  // 0 is load/unload
  // 1 is balance
  function setTask(type) {
    if (type === 0) {
      localStorage.setItem("jobType", "Load/Unload");
      navigate("/select-containers");
    } else if (type === 1){
      localStorage.setItem("jobType", "Balance");
      navigate("/balance");
    }else{
      alert("set task called with invalid args")
    }
  };

  return (
    <div className="task-selection-container">
      <Navbar />
      {/* <h1>Welcome to KawrgoJumper</h1> */}
	  <h1 style={{padding:"4%"}}>Select task:</h1>
      <div className="button-row">
        <button onClick={()=>{setTask(0)}} className="task-selection-button"> Load/Unload </button>
        <button onClick={()=>{setTask(1)}} className="task-selection-button"> Balance </button>
      </div>
    <h1 style={{padding:"4%"}}>Current Manifest:</h1>
    <div className="shaded-text-box large">
      {localStorage.manifestFileName}
    </div>
    </div>
  );
}

export default TaskSelection;
