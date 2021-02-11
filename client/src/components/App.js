import React from 'react'

import './App.scss'

import Main from './Main'
import WelcomeScreen from './WelcomeScreen/WelcomeScreen'

export default class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            screen: 2
        }
    }

    render(){
        switch(this.state.screen){
            case 1:
                return < WelcomeScreen />
            case 2:
                return < Main />
        }
    }
}