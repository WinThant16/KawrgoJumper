import React, { useState } from "react";
import "./../styles/LoadContainers.css";

function LoadContainers() {
  const [totalContainers, setTotalContainers] = useState(""); // Total containers to load
  const [remainingContainers, setRemainingContainers] = useState(null); // Remaining containers
  const [currentContainer, setCurrentContainer] = useState({
    name: "",
    weight: "",
  }); // Details of the current container
  const [loadedContainers, setLoadedContainers] = useState([]); // Array of loaded containers
  const [error, setError] = useState(""); // Error message

  // Start loading process
  const startLoading = () => {
    if (!totalContainers || totalContainers <= 0) {
      setError("Please enter a valid number of containers.");
      return;
    }
    setRemainingContainers(parseInt(totalContainers));
    setError("");
  };

  // Handle loading the next container
  const handleNextContainer = () => {
    if (!currentContainer.name || !currentContainer.weight) {
      setError("Please enter both the container name and weight.");
      return;
    }

    // Add current container to loaded containers
    setLoadedContainers([
      ...loadedContainers,
      { ...currentContainer, id: loadedContainers.length + 1 },
    ]);
    setCurrentContainer({ name: "", weight: "" }); // Reset current container

    if (remainingContainers - 1 > 0) {
      setRemainingContainers(remainingContainers - 1);
    } else {
      alert("All containers have been successfully loaded!");
      resetForm(); // Reset the form after completing
    }
    setError("");
  };

  // Reset the form
  const resetForm = () => {
    setTotalContainers("");
    setRemainingContainers(null);
    setLoadedContainers([]);
    setCurrentContainer({ name: "", weight: "" });
    setError("");
  };

  return (
    <div className="load-containers">
      {remainingContainers === null ? (
        <div className="start-loading">
          <h1>Load Containers</h1>
          <p>Enter the total number of containers to load:</p>
          <input
            type="number"
            value={totalContainers}
            onChange={(e) => setTotalContainers(e.target.value)}
            placeholder="Enter number of containers"
          />
          <button onClick={startLoading}>Start Loading</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="loading-process">
          <h1>Loading Process</h1>
          <p>Containers left to load: {remainingContainers}</p>
          <div className="container-form">
            <input
              type="text"
              value={currentContainer.name}
              onChange={(e) =>
                setCurrentContainer({ ...currentContainer, name: e.target.value })
              }
              placeholder="Enter Container Name"
            />
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
            />
            <button onClick={handleNextContainer}>Next Container</button>
            {error && <p className="error">{error}</p>}
          </div>
          <div className="loaded-list">
            <h2>Loaded Containers</h2>
            <ul>
              {loadedContainers.map((container) => (
                <li key={container.id}>
                  {container.name} - {container.weight}kg
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
