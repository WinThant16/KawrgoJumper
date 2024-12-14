import React, { useEffect, useState } from "react";
import "../styles/Grid.css";
import { deepCopyManifest } from "../lib/taskcommon";

function isPositionInArray(array, row, col, manifest_matrix) {
  return array.some((position) => {
    return (
      position[0] === manifest_matrix.length - row - 1 && position[1] === col
    );
  });
}

function Grid({
  manifest_matrix, // Pass the manifest content as a prop
  selected_containers = [], //green
  onCellClick,
  hoveredContainer,
  setHoveredContainer,
  destination_container = [],
  path_containers = [],
  start_container = [],
}) {
  //const [gridData, setGridData] = useState([]);
  const rows = manifest_matrix.length;
  const cols = manifest_matrix[0].length;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="grid-container">
      {deepCopyManifest(manifest_matrix).reverse().map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid-row">
          {row.map((cell, colIndex) => {
            let className;
            if (isPositionInArray(destination_container, rowIndex, colIndex, manifest_matrix)) {
              className = "grid-cell destination";
            } else if (isPositionInArray(start_container, rowIndex, colIndex, manifest_matrix)) {
              className = "grid-cell source";
            } else if (isPositionInArray(path_containers, rowIndex, colIndex, manifest_matrix)) {
              className = "grid-cell path";
            }  else if (cell.name === "NAN") {
              className = "grid-cell nan";
            } else if (cell.name === "UNUSED") {
              className = "grid-cell unused";
            } else if (
              isPositionInArray(selected_containers, rowIndex, colIndex, manifest_matrix)
            ) {
              className = "grid-cell used selected";
            } else {
              className = "grid-cell used";
            }

            const truncatedName = truncateText(cell.name, 8);

            return (
              <div
                key={`cell-${colIndex}`}
                className={className}
                onMouseEnter={() =>
                  setHoveredContainer &&
                  setHoveredContainer({
                    name: cell.name,
                    weight: cell.weight,
                    row: rowIndex,
                    col: colIndex,
                  })
                }
                onMouseLeave={() =>
                  setHoveredContainer &&
                  setHoveredContainer({ name: "", weight: "", row: 0, col: 0 })
                }
                onClick={() =>
                  onCellClick && onCellClick(rowIndex, colIndex, cell)
                }
              >
                <span className="cell-text">{truncatedName}</span>
                {hoveredContainer &&
                  hoveredContainer.name === cell.name &&
                  hoveredContainer.row === rowIndex &&
                  hoveredContainer.col === colIndex && (
                    <div className="hover-popup">
                      <p>{`Name: ${cell.name}`}</p>
                      <p>{`Weight: ${cell.weight}kg`}</p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;
