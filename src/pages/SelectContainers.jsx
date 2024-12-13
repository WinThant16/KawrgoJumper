import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";
import { useNavigate } from "react-router-dom";
import { submitLog } from "../lib/requestLib";
import "../styles/SelectContainers.css";

function SelectContainers() {
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [hoveredContainer, setHoveredContainer] = useState({ name: "", weight: "", row: 0, col: 0 });
  const currentFile = localStorage.getItem("manifestFileName");
  const jobType = localStorage.getItem("jobType");
  const manifestContent = localStorage.getItem("manifestFileContent");
  const navigate = useNavigate();

  const selectedContainer = (row, col, container) => {
    if (container.name === "UNUSED" || container.name === "NAN") return;
    const key = `[${8 - row},${col + 1}]`;
    const isSelected = selectedContainers.some((item) => item.position === key);

    const cont_name = container.name;
    if (isSelected) {
      setSelectedContainers(selectedContainers.filter((item) => item.position !== key));
      submitLog(`Container '${cont_name}' at position [${8 - row},${col + 1}] is deselected.`);
    } else {
      setSelectedContainers([...selectedContainers, { position: key, name: container.name, weight: container.weight }]);
      submitLog(`Container '${cont_name}' at position [${8 - row},${col + 1}] is selected.`);
    }
  };

  const beginProcess = () => {
    submitLog("Done Selecting Containers to Unload.");
    submitLog("Selecting Containers to Load.");
    navigate("/load-containers");
  };

  return (
    <div className="select-containers-page">
      <Navbar />
      <div className="info-section">
        <div className="info-box">
          <span className="info-label">
            <strong>Current File: </strong>
          </span>
          <span className="info-value">{currentFile}</span>
        </div>
        <div className="info-box">
          <span className="info-label">
            <strong>Job:</strong>
          </span>
          <span className="info-value">{jobType}</span>
        </div>
        <button className="begin-button" onClick={beginProcess}>
          Begin
        </button>
      </div>
      <div className="content-container">
        <h4>Please Select Containers to Unload</h4>
        <Grid
          manifestContent={manifestContent} // Pass manifest content
          selectedContainers={selectedContainers}
          onCellClick={selectedContainer}
          hoveredContainer={hoveredContainer}
          setHoveredContainer={setHoveredContainer}
        />
      </div>
    </div>
  );
}

export default SelectContainers;
