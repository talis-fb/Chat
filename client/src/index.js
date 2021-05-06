import React from 'react';
import ReactDOM from 'react-dom';
// import ReactRouter from 'react-router-dom'
import './index.scss';
import Auth from './pages/Chat/Components/AuthService/AuthService'

import Home from './pages/Home_Page/WelcomeScreen'
import Chat from './pages/Chat/App'


const browserWithAuth = Auth.getCurrentUser() 

ReactDOM.render(
	(browserWithAuth ? <Chat/> : <Home/>),
	document.getElementById('root')
)
