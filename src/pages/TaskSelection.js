import React from "react";
import "../styles/TaskSelection.css";
import Navbar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom";
import { computeBalance, submitLog } from "../lib/requestLib.js";

function TaskSelection() {
  const navigate = useNavigate();

  // Save the current page in localStorage
  localStorage.setItem("currentPage", "task-selection");

  // Handle task selection
  async function setTask(type) {
    if (type === 0) {
      localStorage.setItem("jobType", "Load/Unload");
      submitLog("Load/Unload Operation was selected.");
      submitLog("Selecting Containers to Unload.");
      navigate("/select-containers");
    } else if (type === 1){
      localStorage.setItem("jobType", "Balance");
      submitLog("Balance Operation was selected.");
      const steps = await computeBalance();
      localStorage.setItem("steps", JSON.stringify(steps));
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
