import React, {useState} from "react";
import "../styles/TaskSelection.css";
import Navbar from "../components/Navbar.js";
import { useNavigate } from "react-router-dom";
import { submitLog,saveManifest } from "../lib/requestLib.js";

function Summary() {
  const navigate = useNavigate();
  const [saved_path, setSavedPath] = useState("");

  localStorage.setItem('currentPage', 'summary');		//update current page in local storage

    let saved_path_storage = localStorage.getItem("saved_path");
    if(!saved_path_storage){
        const name = localStorage.getItem("manifestFileName");
        const contents = localStorage.getItem("manifestFileContent");
        saveManifest(name, contents).then((path)=>{
            saved_path_storage = path;
            localStorage.setItem("saved_path", saved_path_storage)
            setSavedPath(saved_path_storage);
            submitLog (`Operations for selected task are complete. New manifest has been saved to ${path}`);
        });
    }
  const reset = () => {
    const user = localStorage.getItem("username");
    localStorage.clear();
    localStorage.setItem("username", user);
    navigate("/upload-manifest")
  }
  return (
    <div className="task-selection-container">
      <Navbar />
      <h1 style={{ marginTop: "10vh" }}>Done!</h1>
      <h1 style={{ padding: "1%" }}>Return the crane to park!</h1>
      <h1>Manifest saved to Desktop as:</h1>
      <div className="shaded-text-box large">
        {saved_path}
      </div>
      <h1 style={{ padding: "2%" }}>Remember to email the captain!</h1>
      <button
          onClick={() => reset()}
          className="task-selection-button"
        >
          Back to Upload Screen
        </button>
    </div>
  );
}

export default Summary;
