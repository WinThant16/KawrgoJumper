import React, { useState, useEffect} from 'react';
import logo from '../assets/KawrgoJumperShippingLogisticsLogo.png';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
// const { logFileHandler } = require('../lib/logfile.js');

// const logger = new logFileHandler();			//initialize logger
import { submitLog } from '../lib/requestLib';

function Home() {
	const [username, setUsername] = useState('');
	const navigate = useNavigate();

	const handleLogin = () => {
		if (username) {
			submitLog(username + " has logged in.");
			// logger.writeEntry(`${username} has logged in.`);
			localStorage.setItem('username', username);
			//navigate to previous page, if set
			if (localStorage.currentPage){
				navigate(`/${localStorage.currentPage}`)
			}else{
				navigate('/upload-manifest');
			}
		}
		else {
			alert('Please enter username.');
		}
	};

	useEffect(() => {
		if (localStorage.username){
			navigate(`/${localStorage.currentPage}`)
		}
	}, []);

	return (
		<div className="home-container">
			<img src = {logo} alt = "KawrgoJumper Logo" className='home-logo'></img>
			{/* <h1>Welcome to KawrgoJumper</h1> */}
			<input
				type = "text"
				placeholder="USERNAME"
				value ={username}
				onChange={(e) => setUsername(e.target.value)}
				className='home-input'/>
			<button onClick={handleLogin} className='home-login-button'>
				Log In
			</button>
		</div>
	);
}

export default Home;
