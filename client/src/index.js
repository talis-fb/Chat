import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Auth from './pages/AuthService'

import Home from './pages/Home_Page/WelcomeScreen'
import Chat from './pages/Chat/index'


const browserWithAuth = Auth.getCurrentUser() 

ReactDOM.render(
	(browserWithAuth ? <Chat/> : <Home/>),
	document.getElementById('root')
)
