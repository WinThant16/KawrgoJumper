import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";
import { useNavigate } from "react-router-dom";
import { submitLog, uploadManifest } from "../lib/requestLib";
import "../styles/SelectContainers.css";
import { container, matrix_to_string, parse_manifest } from "../lib/manifest_parser";
import { shallow_extended_matrix } from "../lib/taskcommon";

function MoveContainersLoad(){
  const [stepi, setStep] = useState(0);
  //const [manifest_matrix, setManifest] = useState({});
  //const [manifest_name, setManifestName] = useState("");

  localStorage.setItem('currentPage', 'move-containers-load');

  const saved_stepi = Number(localStorage.getItem("load-stepi"));
  if(saved_stepi !== stepi && saved_stepi !== null){
    setStep(saved_stepi);
  }

  const [hoveredContainer, setHoveredContainer] = useState({ name: "", weight: "", row: 0, col: 0 });
  const currentFile = localStorage.getItem("manifestFileName");
  const jobType = localStorage.getItem("jobType");
  const containers_to_load = JSON.parse(localStorage.getItem("containers_to_load"));

  const manifest_matrix_noextend = parse_manifest(localStorage.getItem("manifestFileContent"));
  const manifest_matrix = shallow_extended_matrix(manifest_matrix_noextend);
    //setManifestName(localStorage.getItem("manifestFileName"));
    //setManifest(shallow_extended_matrix(parse_manifest(localStorage.getItem("manifestFileContent"), [])));
  
  const navigate = useNavigate();

  let destination_container;// = [steps[0].path[steps[0].path.length-1]];
  let start_container;// = [steps[0].source];
  let path_containers;// = steps[0].path;
  const steps = JSON.parse(localStorage.getItem("load_steps")); //{"destination": [1,2], "start": [3,4], "path":[[1,2],[3,4]]} //localStorage.getItem("steps")

  let container_name_label;
  let container_pos;
  if(stepi < steps.length){
    container_name_label = containers_to_load[stepi].name;
    container_pos = `[${steps[stepi].destination[0]},${steps[stepi].destination[1]}]`;
  }

  //localStorage.setItem("currentPage", "move-containers-unload");
  //console.log("steps", localStorage.getItem("steps"))
  
  //console.log(steps[0])
 // console.log(steps[0].path, steps[0].path.length-1)
  //console.log([steps[0].path[steps[0].path.length-1]])
  //console.log("steps", steps);
  //console.log("outside processstep", stepi)

  const processStep = () =>{
    // console.log("inside processstep", stepi)
    // console.log("AAA", steps[stepi])
    // console.log("BBB", steps[stepi].path, steps[stepi].path.length-1)
    // console.log("CCC", [steps[stepi].path[steps[stepi].path.length-1]])
    destination_container = [steps[stepi].path[steps[stepi].path.length-1]]
    start_container = [steps[stepi].path[0]];
    path_containers = steps[stepi].path;
  }

  const nextStep = () => {
    const destination = steps[stepi].path[steps[stepi].path.length-1];
    //const source = steps[stepi].source
    const dest_container = manifest_matrix[destination[0]][destination[1]];
    //const src_container = manifest_matrix[source[0]][source[1]];
    dest_container.name = containers_to_load[stepi].name
    dest_container.weight = containers_to_load[stepi].weight
    //setManifest(manifest_matrix);
    localStorage.setItem("manifestFileContent",matrix_to_string(manifest_matrix_noextend))
    if(stepi < steps.length-1){
      localStorage.setItem("load-stepi", stepi+1);
      setStep(stepi+1);
      processStep();
    }else{
      uploadManifest(localStorage.getItem("manifestFileName"), localStorage.getItem("manifestFileContent"));
      navigate("/summary");
    }
  };
  if(stepi < steps.length){
    processStep();
  }
  
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
        <div className="info-box">
          <span className="info-label">
            <strong>ETA:</strong>
          </span>
          <span className="info-value">{2121}</span>
        </div>
        <button className="begin-button" onClick={nextStep}>
          Next
        </button>
      </div>
      <div className="content-container">
      <div className="info-box">
          <span className="info-label">
          <strong>Current Task: </strong>
            <bold>Load container {container_name_label} to {container_pos}</bold>
          </span>
        </div>
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

export default MoveContainersLoad;
