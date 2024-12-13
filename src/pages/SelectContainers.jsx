import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Grid from "../components/Grid";
import "../styles/SelectContainers.css";
import { useNavigate } from "react-router-dom";

function SelectContainers() {
	const [selectedContainers, setSelectedContainers] = useState([]);
	const manifestData = localStorage.getItem("manifestFileContent");
	const currentFile = localStorage.getItem("manifestFileName");
	const jobType = localStorage.getItem("jobType");
	const navigate = useNavigate();

	const beginProcess = () => {
		navigate("/move-containers");
	};

	return (
		<div className="select-containers-page">
			<Navbar />
			<div className="info-section">
				<div className="info-box">
				<p>
					<strong>Current File: </strong>
				</p>
				<p>{currentFile}</p>
				</div>
				<div className="info-box">
				<p>
					<strong>Job:</strong>
				</p>
				<p>{jobType}</p>
				</div>
				<button className="begin-button" onClick={beginProcess}>Begin</button>
			</div>
			<div className="content-container">
				<h4>Please Select Containers to Unload</h4>
				<Grid
				manifestData={manifestData}
				selectedContainers={selectedContainers}
				setSelectedContainers={setSelectedContainers}
				/>
			</div>
		</div>
	);
}

export default SelectContainers;
