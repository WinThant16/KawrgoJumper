import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";
import { useNavigate } from "react-router-dom";
import { submitLog } from "../lib/requestLib";
import "../styles/SelectContainers.css";
import { parse_manifest } from "../lib/manifest_parser";
import { shallow_extended_matrix } from "../lib/taskcommon";

let manifest_matrix;
let manifest_name = "";

function MoveContainersUnload(){
  const [stepi, setStep] = useState(0);
  //const [manifest_matrix, setManifest] = useState({});
  //const [manifest_name, setManifestName] = useState("");
  const [hoveredContainer, setHoveredContainer] = useState({ name: "", weight: "", row: 0, col: 0 });
  const currentFile = localStorage.getItem("manifestFileName");
  const jobType = localStorage.getItem("jobType");
  if(manifest_name !== localStorage.getItem("manifestFileName")){
    manifest_name = localStorage.getItem("manifestFileName");
    manifest_matrix = shallow_extended_matrix(parse_manifest(localStorage.getItem("manifestFileContent"), []));
    //setManifestName(localStorage.getItem("manifestFileName"));
    //setManifest(shallow_extended_matrix(parse_manifest(localStorage.getItem("manifestFileContent"), [])));
  }
  const navigate = useNavigate();

  let destination_container;// = [steps[0].path[steps[0].path.length-1]];
  let start_container;// = [steps[0].source];
  let path_containers;// = steps[0].path;
  const steps = JSON.parse(localStorage.getItem("steps")); //{"destination": [1,2], "start": [3,4], "path":[[1,2],[3,4]]} //localStorage.getItem("steps")

  //localStorage.setItem("currentPage", "move-containers-unload");
  //console.log("steps", localStorage.getItem("steps"))
  
  //console.log(steps[0])
 // console.log(steps[0].path, steps[0].path.length-1)
  //console.log([steps[0].path[steps[0].path.length-1]])
  console.log("steps", steps);
  console.log("outside processstep", stepi)
  const processStep = () =>{
    console.log("inside processstep", stepi)
    console.log("AAA", steps[stepi])
    console.log("BBB", steps[stepi].path, steps[stepi].path.length-1)
    console.log("CCC", [steps[stepi].path[steps[stepi].path.length-1]])
    destination_container = [steps[stepi].path[steps[stepi].path.length-1]]
    start_container = [steps[stepi].source];
    path_containers = steps[stepi].path;
  }

  const nextStep = () => {
    const destination = steps[stepi].path[steps[stepi].path.length-1];
    const source = steps[stepi].source
    const dest_container = manifest_matrix[destination[0]][destination[1]];
    const src_container = manifest_matrix[source[0]][source[1]];
    if(steps[stepi].destination === "TRUCK"){
      console.log("clear")
      src_container.clear();
      console.log("cleared", src_container);
    }else{
      console.log("swap")
      console.log("preswap ", dest_container, src_container)
      dest_container.swap(src_container);
      console.log("swapped ", dest_container, src_container)
    }
    //setManifest(manifest_matrix);
    setStep(stepi+1);
    processStep();
    //navigate("/");
  };

  processStep();
  
  return (
    <div className="select-containers-page">
      <Navbar />
      <div className="info-section">
        <div className="info-box">
          <span className="info-label">
            <strong>Current File: </strong>
          </span>
          <span className="info-value">{currentFile}</span>
        </div>
        <div className="info-box">
          <span className="info-label">
            <strong>Job:</strong>
          </span>
          <span className="info-value">{jobType}</span>
        </div>
        
        <button className="begin-button" onClick={nextStep}>
          Next
        </button>
      </div>
      <div className="content-container">
        <h4>Please Select Containers to Unload</h4>
        <Grid
          manifest_matrix={manifest_matrix} // Pass manifest content
          onCellClick={()=>{}}
          hoveredContainer={hoveredContainer}
          setHoveredContainer={setHoveredContainer}
          destination_container={destination_container}
          start_container={start_container}
          path_containers={path_containers}
        />
      </div>
    </div>
  );
}

export default MoveContainersUnload;
