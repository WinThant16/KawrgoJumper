import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.js';
import '../styles/UploadManifest.css';

function UploadManifest() {
	// state to store selected file
	const [fileName, setFileName] = useState('None');     //state to track uploaded file's name
	const [file, setFile] = useState(null);				  //state to store actual file object
	const navigate = useNavigate();						  // state with navigation hook for moving to next page
	localStorage.setItem('currentPage', 'upload-manifest');		//update current page in local storage
	/*
	* Load progress from local storage when component is mounted.
	*/
	useEffect(() => {
		const savedFileName = localStorage.getItem('manifestFileName'); // Get saved file name
		if (savedFileName) {
			setFileName(savedFileName); // Restore the saved file name
			setFile({ name: savedFileName }); // Simulate a file object
		}
	}, []);

	/* 	this handles file input change event.
	   	triggered when a user selects file, 
	   	this updates the state with the selected file */
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];			//get selected file
		if (selectedFile) {
			setFileName(selectedFile.name);					//update state with selected file
			setFile(selectedFile);							//store selected file object
			localStorage.setItem('manifestFileName', selectedFile.name);	//save file name in local storage
			selectedFile.text().then(text => localStorage.setItem('manifestFile', text));	//save file content in local storage
		}
	};
	/* 	this handles form submission.
		this function is triggered when user clicks the submit/next button
		it checks if file has been uploaded and navigates to next page if valid */
	const handleSubmit = (e) => {
		e.preventDefault();
		if (file) {
			// alert(`Manifest file "${file.name}" uploaded successfully!`)			//to debug, commented out now.
			console.log('File uploaded:', file.name); //log uploaded name to debug
			navigate('/task-selection');              //navigate to next page
		} else {
			alert ('Please upload a manifest file.'); //show alert if no file is selected.
		}
	}

	return (
		<div className="upload-manifest-container">
			{/* Navbar */}
			<Navbar />

			{/* Upload Section */}
			<div className='upload-section'>
				<form onSubmit={handleSubmit} >
					<label htmlFor="manifest" className='upload-button'>
						Upload Manifest File
						<input	type = 'file' 
								id ='manifest' 
								accept='.txt,.csv' 
								onChange={handleFileChange} 
								required
								className='file-input' />
					</label> 
					<div className='current-file'>
						<h3>Current Manifest File:</h3>
						<p className='file-name'>{fileName}</p>
					</div>


					{/* display continue to select task after upload */}
					{file && (
						<button type='submit' className='btn btn-primary mt-4'>
						Continue to Select Task
						</button>
					)}	
				</form>
			</div>
		</div>
	);
}

export default UploadManifest;