import React, { useEffect, useState } from "react";
import "../styles/Grid.css";

function GridMovement({ manifestContent, steps, currentStepIndex }) {
  const [gridData, setGridData] = useState([]);

  // Load manifest into gridData
  const loadManifest = () => {
    const rows = 10; // Includes temp rows
    const cols = 12;
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ name: "TEMP", weight: 0 }))
    );

    if (manifestContent) {
      const lines = manifestContent.split("\n");
      lines.forEach((line) => {
        const [coordinates, weight, name] = line.split(", ");
        const row = parseInt(coordinates.slice(1, 3)) - 1;
        const col = parseInt(coordinates.slice(4, 6)) - 1;

        grid[9 - row][col] = {
          name: name.trim(),
          weight: parseInt(weight.replace(/[{}]/g, ""), 10),
        };
      });
    }

    setGridData(grid);
  };

  useEffect(() => {
    loadManifest();
  }, [manifestContent]);

  // Highlight cells based on steps
  const getClassName = (rowIndex, colIndex) => {
    if (rowIndex >= 8) return "grid-cell temp"; // Temporary rows
    const step = steps[currentStepIndex];
    if (!step) return "grid-cell unused";

    const isSource = step.source[0] === rowIndex && step.source[1] === colIndex;
    const isDestination =
      step.destination[0] === rowIndex && step.destination[1] === colIndex;

    if (isSource) return "grid-cell source";
    if (isDestination) return "grid-cell destination";
    return gridData[rowIndex][colIndex].name !== "TEMP"
      ? "grid-cell used"
      : "grid-cell unused";
  };

  return (
    <div className="grid-container">
      {gridData.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={getClassName(rowIndex, colIndex)}
            >
              <span className="cell-text">
                {cell.name === "TEMP" ? "TEMP" : cell.name}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GridMovement;
