import React, { useState } from "react";
import "../styles/LoadContainers.css"; // Reuse styles
import Navbar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { submitLog } from "../lib/requestLib";

function LoadContainers() {
  const [totalContainers, setTotalContainers] = useState("");
  const [remainingContainers, setRemainingContainers] = useState(null);
  const [currentContainer, setCurrentContainer] = useState({
    name: "",
    weight: "",
  });
  const [loadedContainers, setLoadedContainers] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize navigation

  localStorage.setItem("currentPage", "load-containers");

  const startLoading = () => {
    if (!totalContainers || totalContainers <= 0) {
      if (
        window.confirm(
          "You entered 0 containers. Would you like to move forward to the next step?"
        )
      ) {
        setRemainingContainers(0); // Move forward with 0 containers
        setError("");
        navigate("/move-containers-unload"); // Navigate to the next step
      } else {
        setTotalContainers(""); // Reset the form
        setError("");
      }
      return;
    }
    setRemainingContainers(parseInt(totalContainers));
    setError("");
  };

  const handleNextContainer = () => {
    if (!currentContainer.name || currentContainer.name.length > 255) {
      setError("Container name is required and must be less than 256 characters.");
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

    setLoadedContainers([
      ...loadedContainers,
      { ...currentContainer, id: loadedContainers.length + 1 },
    ]);
    const loaded_containers_state_bypass = [
      ...loadedContainers,
      { ...currentContainer, id: loadedContainers.length + 1 },
    ];
    // console.log("loaded containers", loaded_containers_state_bypass)
    // Log loaded container
    submitLog(
      `Container loaded: Name - "${currentContainer.name}", Weight - ${currentContainer.weight}kg.`
    );
    setCurrentContainer({ name: "", weight: "" });

    if (remainingContainers - 1 > 0) {
      setRemainingContainers(remainingContainers - 1);
    } else {
      if (
        window.confirm(
          "All containers have been successfully loaded. Would you like to move to the next step?"
        )
      ) {
        submitLog(
          `All containers (${totalContainers}) have been successfully loaded.`
        );
        localStorage.setItem(
          "containers_to_load",
          JSON.stringify(loaded_containers_state_bypass)
        );
        navigate("/move-containers-unload"); // Navigate to MoveContainersUnload page
      } else {
        // User cancels navigation; remain on the current page
        setRemainingContainers(0); // Reset remaining containers to 0
      }
    }
    setError("");
  };

  const handleDeleteContainer = (id) => {
    const containerToDelete = loadedContainers.find(
      (container) => container.id === id
    );

    const updatedContainers = loadedContainers.filter(
      (container) => container.id !== id
    );
    setLoadedContainers(updatedContainers);
    setRemainingContainers((prevCount) => prevCount + 1); // Increment remaining containers

    // Log the deleted container
    if (containerToDelete) {
      submitLog(
        `Container deleted: Name - "${containerToDelete.name}", Weight - ${containerToDelete.weight}kg.`
      );
    }
  };

  const resetForm = () => {
    setTotalContainers("");
    setRemainingContainers(null);
    setLoadedContainers([]);
    setCurrentContainer({ name: "", weight: "" });
    setError("");
  };

  return (
    <div className="task-selection-container">
      <Navbar />
      {remainingContainers === null ? (
        <div>
          <h1>Load Containers</h1>
          <p>Enter the total number of containers to load:</p>
          <input
            type="number"
            value={totalContainers}
            onChange={(e) => setTotalContainers(e.target.value)}
            placeholder="Enter number of containers"
            className="shaded-text-box large"
          />
          <button onClick={startLoading} className="task-selection-button">
            Start Loading
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="splitScreen">
          <div className="left">
            <h1>Loading Process</h1>
            <p>Containers left to load: {remainingContainers}</p>
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
                {(!currentContainer.name || currentContainer.name.length > 255) && error && (
                  <p className="error">Container name is required and must be shorter than 256 characters.</p>
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
                Next Container
              </button>
            </div>
          </div>
          <div className="right">
              <h2>Loaded Containers</h2>
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
      )}
    </div>
  );
}

export default LoadContainers;
