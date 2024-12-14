import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";
import { useNavigate } from "react-router-dom";
import {computeUnload, submitLog } from "../lib/requestLib";
import "../styles/SelectContainers.css";
import { parse_manifest } from "../lib/manifest_parser";

function SelectContainers(){
  const [gridData, setGridData] = useState([]);
  const [selected_containers, setSelectedContainers] = useState([]);
  const [hoveredContainer, setHoveredContainer] = useState({ name: "", weight: "", row: 0, col: 0 });

  localStorage.setItem('currentPage', 'select-containers');		//update current page in local storage

  const currentFile = localStorage.getItem("manifestFileName");
  const jobType = localStorage.getItem("jobType");
  const manifest_matrix =  parse_manifest(localStorage.getItem("manifestFileContent"));
  const navigate = useNavigate();

  const selectedContainer = (row, col, container) => {
    if (container.name === "UNUSED" || container.name === "NAN") return;
    const key = [8 - row,col + 1];
    const isSelected = selected_containers.some((position) =>{return position[0] === key[0]-1 && position[1] === key[1]-1});

    const cont_name = container.name;
    if (isSelected) {
      console.log(key[0]-1, key[1]-1)
      setSelectedContainers(selected_containers.filter((item)=> !(item[0] === key[0]-1 && item[1] === key[1]-1) ));
      
      //setSelectedContainers(selectedContainers.filter((item) => item.position !== key));
      submitLog (`Container '${cont_name}' at position [${8-row},${col+1}] is deselected.`);
    } else {
      setSelectedContainers([...selected_containers, [key[0]-1, key[1]-1]]);
      //setSelectedContainers([...selectedContainers, { position: key, name: container.name, weight: container.weight }]);
      submitLog (`Container '${cont_name}' at position [${8-row},${col+1}] is selected.`);
    }
  };

  const beginProcess = async () => {
    submitLog("Done Selecting Containers to Unload.");
    submitLog("Selecting Containers to Load.");
    //const zero_indexed_selected_containers = []; // it really shoudlve been 0indexed in the first place
    //for(let i = 0; i<selected_containers.length; i++){
    //  zero_indexed_selected_containers.push([selected_containers[i][0]-1, selected_containers[i][1]-1]);
    //}
    //console.log("containers to move", selected_containers)

    localStorage.setItem("selected_containers", JSON.stringify(selected_containers));
    const steps = await computeUnload(selected_containers);
    localStorage.setItem("steps", JSON.stringify(steps));
    localStorage.setItem("cur_step", 0);
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
          manifest_matrix={manifest_matrix} // Pass manifest content
          selected_containers={selected_containers}
          onCellClick={selectedContainer}
          hoveredContainer={hoveredContainer}
          setHoveredContainer={setHoveredContainer}
        />
      </div>
    </div>
  );
}

export default SelectContainers;
