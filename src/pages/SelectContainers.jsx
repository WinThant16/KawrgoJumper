import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import "../styles/SelectContainers.css";
import { useNavigate } from "react-router-dom";

function SelectContainers(){
  const [gridData, setGridData] = useState([]);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [hoveredContainer, setHoveredContainer] = useState({ name: "", weight: "", row: 0, col: 0 });
  const currentFile = localStorage.getItem("manifestFileName");
  const jobType = localStorage.getItem("jobType");
  const navigate = useNavigate();

  const loadManifest = () => {
    const manifest = localStorage.getItem("manifestFileContent");

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

      if (rowIdx >= 0 && colIdx >= 0 && rowIdx < rows && colIdx < cols){
        grid[rowIdx][colIdx] = { id: `${row},${col}`, name: name.trim(), weight: parseInt(weight.replace(/[{}]/g, ""), 10),};
      }
    }
    setGridData(grid);
  };

  useEffect(() => {
    loadManifest();
  }, []);

  const selectedContainer = (row, col, container) => {
    if (container.name === "UNUSED" || container.name === "NAN") return;
    const key = `[${8 - row},${col + 1}]`;
    const isSelected = selectedContainers.some((item) => item.position === key);

    if (isSelected) {
      setSelectedContainers(selectedContainers.filter((item) => item.position !== key));
    } else {
      setSelectedContainers([...selectedContainers, { position: key, name: container.name, weight: container.weight }]);
    }
  };

  const beginProcess = () =>{
    navigate("/move-containers");
  }

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  const displayGrid = () => {
    return gridData.map((row, rowIndex) => (
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
          
          const truncatedName = truncateText(cell.name, 8);      //max length set to 12.

          return (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={className}
              onMouseEnter={() =>
                setHoveredContainer({
                  name: cell.name,
                  weight: cell.weight,
                  row: rowIndex,
                  col: colIndex,
                })
              }
              onMouseLeave={() => setHoveredContainer({ name: "", weight: "", row: 0, col: 0 })}
              onClick={() => selectedContainer(rowIndex, colIndex, cell)}
            >
              <span className="cell-text">{truncatedName}</span>
              {/* {cell.name !== "NAN" ? cell.name.split(" ")[0] : ""} */}
              {hoveredContainer.name === cell.name &&
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
    ));
  };

  return (
    <div className="select-containers-page">
      <Navbar />
      <div className="info-section">
        <div className="info-box">
          <p><strong>Current File: </strong></p>
          <p>{currentFile}</p>
        </div>
        <div className="info-box">
          <p><strong>Job:</strong></p>
          <p>{jobType}</p>
        </div>
        <button className="begin-button" onClick={beginProcess}>Begin</button>
      </div>
      <div className="content-container">
        <h4>Please Select Containers to Unload</h4>
        <div className="grid-container">{displayGrid()}</div>
      </div>
    </div>
  );
}

export default SelectContainers;