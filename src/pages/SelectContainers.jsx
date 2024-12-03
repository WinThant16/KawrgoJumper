import React from "react";
import Navbar from "../components/Navbar";
import "../styles/SelectContainers.css";

function SelectContainers(){
  const gridData = Array(8).fill(Array(12).fill("UNUSED"));
  
  return (
    <div classname = "select-containers-cont">
      <Navbar />
      <div className="content-container">
        <h1>Please Select Containers to Unload</h1>
        <div className="grid-container">
          {gridData.map((row, rowIndex) => (
            <div key={'row-${rowIndex}'} className="grid-row">
              {row.map((cell, colIndex) => (
                <div key={'cell-${rowIndex}-${colIndex}'} className="grid-cell">
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelectContainers;