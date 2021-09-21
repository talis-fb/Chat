import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Auth from './pages/AuthService'

import Home from './pages/Home_Page/WelcomeScreen'
import Teste from './pages/teste'

const browserWithAuth = Auth.getCurrentUser() 

function Index(){

    const [ aute, setaute] = useState(Auth.getCurrentUser())
    useEffect(() => setaute(Auth.getCurrentUser()), [Auth.getCurrentUser()])

    return aute ? <Teste />  : <Home />
}

ReactDOM.render(
    <Index />,
	document.getElementById('root')
)
