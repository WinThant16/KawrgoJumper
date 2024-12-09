import React, { useState } from "react";
import "../styles/TaskSelection.css"; // Reuse styles
import Navbar from "../components/Navbar.js";

function LoadContainers() {
  const [totalContainers, setTotalContainers] = useState("");
  const [remainingContainers, setRemainingContainers] = useState(null);
  const [currentContainer, setCurrentContainer] = useState({
    name: "",
    weight: "",
  });
  const [loadedContainers, setLoadedContainers] = useState([]);
  const [error, setError] = useState("");

  const startLoading = () => {
    if (!totalContainers || totalContainers <= 0) {
      setError("Please enter a valid number of containers.");
      return;
    }
    setRemainingContainers(parseInt(totalContainers));
    setError("");
  };

  const handleNextContainer = () => {
    if (!currentContainer.name) {
      setError("Container name is required.");
      return;
    }
    if (!currentContainer.weight || currentContainer.weight <= 0) {
      setError("Container weight must be a positive number.");
      return;
    }

    setLoadedContainers([
      ...loadedContainers,
      { ...currentContainer, id: loadedContainers.length + 1 },
    ]);
    setCurrentContainer({ name: "", weight: "" });

    if (remainingContainers - 1 > 0) {
      setRemainingContainers(remainingContainers - 1);
    } else {
      alert("All containers have been successfully loaded!");
      resetForm();
    }
    setError("");
  };

  const handleDeleteContainer = (id) => {
    const updatedContainers = loadedContainers.filter(
      (container) => container.id !== id
    );
    setLoadedContainers(updatedContainers);
    setRemainingContainers((prevCount) => prevCount + 1); // Increment remaining containers
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
          <button
            onClick={startLoading}
            className="task-selection-button"
          >
            Start Loading
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div>
          <h1>Loading Process</h1>
          <p>Containers left to load: {remainingContainers}</p>
          <div>
            <div>
              <input
                type="text"
                value={currentContainer.name}
                onChange={(e) =>
                  setCurrentContainer({ ...currentContainer, name: e.target.value })
                }
                placeholder="Enter Container Name"
                className="shaded-text-box large"
              />
              {!currentContainer.name && error && (
                <p className="error">Container name is required.</p>
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
              {!currentContainer.weight && error && (
                <p className="error">Container weight must be a positive number.</p>
              )}
            </div>
            <button
              onClick={handleNextContainer}
              className="task-selection-button"
            >
              Next Container
            </button>
          </div>
          <div>
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
