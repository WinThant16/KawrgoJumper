import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar({ onLogFile, onLogout}) {
	const navigate = useNavigate();
	const [showLogInput, setShowLogInput] = useState(false);  //state for showing log input box

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
			navigate('/');							//redirect to home page(login)
		}
	}

	return (
		<nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
			<div className='container-fluid'>
				<a className="navbar-brand" href="#">
					KawrgoJumper
				</a>
			</div>		
		</nav>
	)
}

export default Navbar;