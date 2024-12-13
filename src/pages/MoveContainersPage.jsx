import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GridMovement from "../components/GridMovement";
import { computeUnload } from "../lib/requestLib";
import "../styles/MoveContainers.css";

function MoveContainersPage() {
  const [manifest, setManifest] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const manifestResponse = await fetch("/api/getCurrentManifest").then((res) =>
          res.json()
        );
        const manifestContent = manifestResponse.fileContents;

        setManifest(manifestContent);

        const unloadSteps = await computeUnload([[7, 1]]);
        setSteps(unloadSteps);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getHighlightedCells = () => {
    if (currentStepIndex === -1 || steps.length === 0) return {};

    const { source, destination, path } = steps[currentStepIndex];

    return {
      source,
      destination: destination !== "TRUCK" ? destination : null,
      path,
    };
  };

  const highlightedCells = getHighlightedCells();

  return (
    <div>
      <Navbar />
      <GridMovement manifestContent={manifest} highlightedCells={highlightedCells} />
      <div className="controls">
        <button onClick={handlePreviousStep} disabled={currentStepIndex <= 0}>
          Previous Step
        </button>
        <button onClick={handleNextStep} disabled={currentStepIndex >= steps.length - 1}>
          Next Step
        </button>
      </div>
    </div>
  );
}

export default MoveContainersPage;
