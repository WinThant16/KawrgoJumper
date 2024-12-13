import React, { useEffect, useState } from "react";
import "../styles/Grid.css";

function GridMovement({
  manifestContent, // Parsed manifest content
  highlightedCells = {}, // Object with source, destination, and path
}) {
  const [gridData, setGridData] = useState([]);

  const loadManifest = () => {
    const rows = 10; // 8 regular rows + 2 temporary rows
    const cols = 12;
    const grid = Array.from({ length: rows }, (_, rowIdx) =>
      Array.from({ length: cols }, () => ({
        id: null,
        name: rowIdx >= 8 ? "Temporary" : "NAN", // Set temporary rows
        weight: 0,
      }))
    );

    // Debug: Check manifestContent
    console.log("Manifest Content:", manifestContent);

    if (manifestContent && typeof manifestContent === "string") {
      // Parse the raw string
      const lines = manifestContent.split("\n");
      lines.forEach((line) => {
        const [coordinates, weight, name] = line.split(", ");
        const row = parseInt(coordinates.slice(1, 3)) - 1;
        const col = parseInt(coordinates.slice(4, 6)) - 1;

        if (row >= 0 && col >= 0 && row < 8 && col < cols) {
          grid[9 - row][col] = {
            id: `${row},${col}`,
            name: name.trim(),
            weight: parseInt(weight.replace(/[{}]/g, ""), 10),
          };
        }
      });
    } else if (Array.isArray(manifestContent)) {
      // If already parsed as an array
      manifestContent.forEach(({ coordinates, weight, name }) => {
        const [row, col] = coordinates;
        if (row >= 0 && col >= 0 && row < 8 && col < cols) {
          grid[9 - row][col] = {
            id: `${row},${col}`,
            name: name.trim(),
            weight: parseInt(weight, 10),
          };
        }
      });
    } else {
      console.error("Invalid manifestContent format");
    }

    setGridData(grid);
  };

  useEffect(() => {
    loadManifest();
  }, [manifestContent]);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="grid-container">
      {gridData.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid-row">
          {row.map((cell, colIndex) => {
            let className = "grid-cell";

            if (cell.name === "Temporary") {
              className = "grid-cell temporary";
            } else if (cell.name === "NAN") {
              className = "grid-cell nan";
            } else {
              // Highlight logic
              if (
                highlightedCells.source &&
                highlightedCells.source[0] === rowIndex &&
                highlightedCells.source[1] === colIndex
              ) {
                className = "grid-cell source";
              } else if (
                highlightedCells.destination &&
                highlightedCells.destination[0] === rowIndex &&
                highlightedCells.destination[1] === colIndex
              ) {
                className = "grid-cell destination";
              } else if (
                highlightedCells.path &&
                highlightedCells.path.some(
                  ([pathRow, pathCol]) => pathRow === rowIndex && pathCol === colIndex
                )
              ) {
                className = "grid-cell path";
              } else {
                className = "grid-cell used";
              }
            }

            const truncatedName = truncateText(cell.name, 8);

            return (
              <div key={`cell-${rowIndex}-${colIndex}`} className={className}>
                <span className="cell-text">{truncatedName}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default GridMovement;
