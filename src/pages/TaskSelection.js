import React from "react";
import "../styles/TaskSelection.css";
import Navbar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom";

function TaskSelection() {
  const navigate = useNavigate();

  // Save the current page in localStorage
  localStorage.setItem("currentPage", "task-selection");

  // Handle task selection
  function setTask(type) {
    if (type === 0) {
<<<<<<< HEAD
      // Load/Unload task
      localStorage.setItem("jobType", "Load/Unload");
      navigate("/load-containers"); // Updated to navigate to LoadContainers
    } else if (type === 1) {
      // Balance task
=======
      localStorage.setItem("jobType", "Load/Unload");
      navigate("/select-containers");
    } else if (type === 1){
>>>>>>> a2894cd55960c77366889857b8ed331744f7c6bc
      localStorage.setItem("jobType", "Balance");
      navigate("/balance");
    } else {
      alert("setTask called with invalid arguments");
    }
  }

  return (
    <div className="task-selection-container">
      <Navbar />
      <h1 style={{ padding: "4%" }}>Select task:</h1>
      <div className="button-row">
        <button
          onClick={() => setTask(0)}
          className="task-selection-button"
        >
          Load/Unload
        </button>
        <button
          onClick={() => setTask(1)}
          className="task-selection-button"
        >
          Balance
        </button>
      </div>
      <h1 style={{ padding: "4%" }}>Current Manifest:</h1>
      <div className="shaded-text-box large">
        {localStorage.manifestFileName || "No Manifest Loaded"}
      </div>
    </div>
  );
}

export default TaskSelection;
