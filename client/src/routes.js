import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom' 

import Home from './pages/Home_Page/WelcomeScreen'
import Chat from './pages/Chat/App'

export default function(){
	return(
		<Router>
			<Switch>				
				<Route path="/chat">
					<Chat />
				</Route>

				<Route path="/" >
					<Home />
				</Route>
			</Switch>
        </Router>
	)
}
