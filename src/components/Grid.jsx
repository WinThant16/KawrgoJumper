import React, { useEffect, useState } from "react";
import "../styles/Grid.css";

function Grid({
  manifestContent, // Pass the manifest content as a prop
  selectedContainers = [],
  onCellClick,
  hoveredContainer,
  setHoveredContainer,
}) {
  const [gridData, setGridData] = useState([]);

  const loadManifest = () => {
    const rows = 8;
    const cols = 12;
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ id: null, name: "NAN", weight: "0" }))
    );

    if (manifestContent) {
      const lines = manifestContent.split("\n");
      lines.forEach((line) => {
        const parts = line.split(", ");
        const coordinates = parts[0];
        const weight = parts[1];
        const name = parts[2];

        const row = parseInt(coordinates.substring(1, 3));
        const col = parseInt(coordinates.substring(4, 6));
        const rowIdx = 8 - row;
        const colIdx = col - 1;

        if (rowIdx >= 0 && colIdx >= 0 && rowIdx < rows && colIdx < cols) {
          grid[rowIdx][colIdx] = {
            id: `${row},${col}`,
            name: name.trim(),
            weight: parseInt(weight.replace(/[{}]/g, ""), 10),
          };
        }
      });
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
            let className;
            if (cell.name === "NAN") {
              className = "grid-cell nan";
            } else if (cell.name === "UNUSED") {
              className = "grid-cell unused";
            } else {
              className = selectedContainers.some(
                (item) => item.position === `[${8 - rowIndex},${colIndex + 1}]`
              )
                ? "grid-cell used selected"
                : "grid-cell used";
            }

            const truncatedName = truncateText(cell.name, 8);

            return (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
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
                  setHoveredContainer && setHoveredContainer({ name: "", weight: "", row: 0, col: 0 })
                }
                onClick={() => onCellClick && onCellClick(rowIndex, colIndex, cell)}
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
