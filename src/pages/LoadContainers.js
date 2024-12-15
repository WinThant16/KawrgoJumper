import React, { useState } from "react";
import "../styles/LoadContainers.css"; // Reuse styles
import Navbar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { submitLog } from "../lib/requestLib";

import { parse_manifest } from "../lib/manifest_parser.js";


function getUnusedSlotsAmnt(manifest_matrix){
  let counter = 0;
  for (let i = 0; i < manifest_matrix.length; i++){
    for(let j = 0; j<manifest_matrix[0].length; j++){
      if(manifest_matrix[i][j].name === "UNUSED"){
        counter++;
      }
    }
  }

  const selected_containers_str = localStorage.getItem("selected_containers");
  if(selected_containers_str !== null){
    counter = counter + JSON.parse(selected_containers_str).length
  }

  return counter;
}

function LoadContainers() {
  const [currentContainer, setCurrentContainer] = useState({
    name: "",
    weight: "",
  });
  const [loadedContainers, setLoadedContainers] = useState([]);
  const [error, setError] = useState("");

  const space_remaining = getUnusedSlotsAmnt(parse_manifest(localStorage.getItem("manifestFileContent")));

  const navigate = useNavigate(); // Initialize navigation

  localStorage.setItem("currentPage", "load-containers");

  const saved_loaded_containers = localStorage.getItem("containers_to_load");
  if(saved_loaded_containers !== null && JSON.stringify(loadedContainers) !== saved_loaded_containers){
    setLoadedContainers(JSON.parse(saved_loaded_containers));
  }

  const handleNextContainer = () => {
    if (!currentContainer.name || currentContainer.name.length > 255) {
      setError(
        "Container name is required and must be less than 256 characters."
      );
      return;
    }
    if (
      !currentContainer.weight ||
      currentContainer.weight <= 0 ||
      currentContainer.weight > 99999
    ) {
      setError(
        "Container weight must be a positive whole number less than or equal to 99999."
      );
      return;
    }

    localStorage.setItem("containers_to_load", JSON.stringify([
      ...loadedContainers,
      { ...currentContainer, id: loadedContainers.length + 1 },
    ]))

    setLoadedContainers([
      ...loadedContainers,
      { ...currentContainer, id: loadedContainers.length + 1 },
    ]);

    // console.log("loaded containers", loaded_containers_state_bypass)
    // Log loaded container
    submitLog(
      `Container inputted: Name - "${currentContainer.name}", Weight - ${currentContainer.weight}kg.`
    );

    setError("");
  };

  const handleDeleteContainer = (id) => {
    const containerToDelete = loadedContainers.find(
      (container) => container.id === id
    );

    const updatedContainers = loadedContainers.filter(
      (container) => container.id !== id
    );
    localStorage.setItem("containers_to_load", JSON.stringify(updatedContainers));
    setLoadedContainers(updatedContainers);

    // Log the deleted container
    if (containerToDelete) {
      submitLog(
        `Container deleted: Name - "${containerToDelete.name}", Weight - ${containerToDelete.weight}kg.`
      );
    }
  };

  const beginUnloadingBut = () => {
    if(loadedContainers.length > space_remaining)
    {
      alert("Cannot continue! You are trying to load more containers than space is available!")
    }else{
      if (loadedContainers.length === 0){
        submitLog(`There are zero selected containers to load.`);
      }
      else {
        submitLog(`There are ${loadedContainers.length} total containers to load.`);
      }
      navigate("/move-containers-unload")
    }
  };

  return (
    <div className="task-selection-container">
      <Navbar />
      <div className="splitScreen">
        <div className="left">
          <h1>Loading Process</h1>
          <div>
            <div>
              <input
                type="text"
                value={currentContainer.name}
                onChange={(e) =>
                  setCurrentContainer({
                    ...currentContainer,
                    name: e.target.value,
                  })
                }
                placeholder="Enter Container Name"
                className="shaded-text-box large"
              />
              {(!currentContainer.name || currentContainer.name.length > 255) &&
                error && (
                  <p className="error">
                    Container name is required and must be shorter than 256
                    characters.
                  </p>
                )}
            </div>
            <div>
              <input
                type="number"
                value={currentContainer.weight}
                onChange={(e) =>
                  setCurrentContainer({
                    ...currentContainer,
                    weight: e.target.value,
                  })
                }
                placeholder="Enter Container Weight"
                className="shaded-text-box large"
              />
              {(currentContainer.weight > 99999 ||
                currentContainer.weight <= 0) &&
                error && (
                  <p className="error">
                    Container weight must be a positive whole number less than
                    or equal to 99999.
                  </p>
                )}
            </div>
            <button
              onClick={handleNextContainer}
              className="task-selection-button"
            >
              Add Container
            </button>
          </div>
        </div>
        <div className="right">
          <div className="info-box">
            <span className="info-label">
              <strong>Max Load Amount: {space_remaining} </strong>
            </span>
          </div>
          <h2>Containers To Load: {loadedContainers.length}</h2>
          <ul className="loaded-list">
            {loadedContainers.map((container) => (
              <li key={container.id}>
                {container.name} - {container.weight}kg
                <button
                  onClick={() => handleDeleteContainer(container.id)}
                  style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={beginUnloadingBut} className="but-begin-unload">
        Begin Unloading/Loading
      </button>
      <strong>If you do not have any containers to load, you may begin without adding containers.</strong>
    </div>
  );
}

export default LoadContainers;
