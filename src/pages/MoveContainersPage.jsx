import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import GridMovement from "../components/GridMovement";
import { computeUnload } from "../lib/requestLib";
import "../styles/MoveContainers.css";

function MoveContainersPage() {
  const [manifest, setManifest] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const manifestResponse = await fetch("/api/getCurrentManifest");
        const { fileContents } = await manifestResponse.json();
        setManifest(fileContents);

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

  return (
    <div>
      <Navbar />
      <div className="info-section">
        <h3>Move Containers</h3>
        <p>Step {currentStepIndex + 1} of {steps.length}</p>
      </div>
      <GridMovement
        manifestContent={manifest}
        steps={steps}
        currentStepIndex={currentStepIndex}
      />
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
