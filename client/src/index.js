import React from 'react';
import ReactDOM from 'react-dom';
// import ReactRouter from 'react-router-dom'
import './index.scss';
import Routes from './routes'
import Auth from './pages/Chat/AuthService/AuthService'

ReactDOM.render(
    <Routes />,
	document.getElementById('root')
)
