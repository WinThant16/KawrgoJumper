import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/KawrgoJumperLogoNarrow.png';
import { submitLog } from '../lib/requestLib';

function Navbar({ onLogFile, onLogout}) {
	const navigate = useNavigate();
	const [showLogInput, setShowLogInput] = useState(false);  //state for showing log input box
	const [logMessage, setLogMessage] = useState('');
	/* handle log button click: 
	toggles display of input box for adding to log file. 
	###########TO DO ###############*/

	const handleLogClick = () => {
		setShowLogInput(!showLogInput); //toggles visibility of log input box
	}

	const handleLogout = () => {
		const confirmLogout = window.confirm(					//confirm method is simple for now, can customize later?
			'Are you sure you want to log out?'
		);
		if (confirmLogout) {
			alert ('You have been logged out.');
			const uname = localStorage.getItem('username');		
			submitLog (`${uname} signs out.`);
			localStorage.removeItem('username');			//clear username?
			navigate('/');							//redirect to home page(login)
		}
	}

	const handleRestart = () => {
		const confirmRestart = window.confirm(					//confirm method is simple for now, can customize later?
			'Are you sure you want to restart (return to manifest upload)?'
		);
		if (confirmRestart) {
			//localStorage.removeItem('manifestFileName');	//clear manifest name
			//localStorage.removeItem('manifestFileContent');	//clear manifest contents
			// We'll have to clear more here as we save more variables
			//localStorage.removeItem('manifestSettled'); 
			
			const user = localStorage.getItem("username");
			localStorage.clear();
			localStorage.setItem("username", user);
			submitLog(`${user} pressed Restart button. Navigating back to upload-manifest page.`);
			// navigate(0);
			navigate('/upload-manifest'); //redirect to upload-manifest
			
		}
	}
	
	const handleLogFile = () => {
		if (logMessage.trim() === ''){
			alert ('Please enter a valid log message.');				//prevent empty submissions.
			return;
		}
		const username = localStorage.getItem('username');
		submitLog (`User ${username} submitted a log note: "${logMessage.trim()}"`);		//submit log
		setLogMessage('');							//clear text box
		setShowLogInput(false)						//hide input box after submit
	}

	return (
		<nav className='navbar navbar-expand-lg navbar-dark fixed-top'>
			<div className='container-fluid'>
				{/* logo/brand */}
				{/* <a className="navbar-brand" href="#">
					KawrgoJumper
				</a> */}
				<img src = {logo} alt = "KawrgoJumper Logo" className='navbar-brand'></img>

				{/* Navigation Buttons */}
				<div className='collapse navbar-collapse'>
					<ul className='navbar-nav ms-auto'>
						{/* Log button */}
						<li className='nav-item'>
							<button	className='btn btn-outline-light me-2'
									onClick={handleLogClick}>
								ENTER LOG NOTE
							</button>
						</li>
						{/* Restart button */}
						<li className='nav-item'>
							<button className='btn btn-outline-light me-2' onClick={handleRestart}>
								RESTART
							</button>
						</li>
						{/* Logout button */}
						<li className='nav-item'>
							<button className='btn btn-outline-light me-2' onClick={handleLogout}>
								LOG OUT
							</button>
						</li>

					</ul>
				</div>
			</div>

			{/* Log input box displayed when log button is clicked 
					#############TO DO: Maybe need to move this away from nav bar##################*/}
			{showLogInput && (
				<div className='log-input-container'>
					<textarea	className='log-input-box'
								placeholder='Enter log message...'
								value={logMessage}
								onChange={(e) => setLogMessage(e.target.value)}			//update state with userinput
					/>
					<button className = "btn btn-primary mt-2" onClick={handleLogFile}>
						Submit Log
					</button>
				</div>
			)}
		</nav>
	);
}

export default Navbar;