import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import "../styles/SelectContainers.css";

function SelectContainers(){
  const [gridData, setGridData] = useState([]);

  const loadManifest = () => {
    const manifest = localStorage.getItem("manifestFile");

    const rows = 8;
    const cols = 12;
    const grid = [];

    for(let i = 0; i < rows; i++){
      const row = [];
      for(let j = 0; j < cols; j++){
        row.push({ id: null, name: "NAN", weight:"0"});
      }
      grid.push(row);
    }

    const lines = manifest.split("\n"); // split into lines
    for(let i = 0; i < lines.length; i++){
      const line = lines[i];
      const parts = line.split(", "); // split into each individual value
      const coordinates = parts[0];
      const weight = parts[1];
      const name = parts[2];

      const row = parseInt(coordinates.substring(1,3));
      const col = parseInt(coordinates.substring(4,6));

      const rowIdx = 8 - row;
      const colIdx = col - 1;

      if(rowIdx >= 0 && colIdx >= 0 && rowIdx < rows && colIdx < cols){
        grid[rowIdx][colIdx] = { id: '${row},${col}', name: name.trim(), weight: parseInt(weight.replace(/[{}]/g, 10))};
      }
    }
    setGridData(grid);
  };

  useEffect(() => {
    loadManifest();
  }, []);
  
  return (
    <div className="select-containers-page">
      <Navbar />
      <div className="content-container">
        <h1>Please Select Containers to Unload</h1>
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
                  className = "grid-cell filled";
                }

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={className}
                  >
                    {cell.name !== "NAN" ? cell.name.split(" ")[0] : ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectContainers;