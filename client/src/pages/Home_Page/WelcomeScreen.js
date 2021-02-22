import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import './WelcomeScreen.scss'


export default class WelcomeScreen extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            option: null,
			redirect: null // <Redirect to="/chat" />
            /* 
             * option...
             * 1 - NEW USER
             * 2 - LOG IN
             */
        }
    }

	requestFromServer(nickname, password){
		// this.setState({ redirect: (<Redirect to="/chat" />) })

		let url

		if(option==1){
			// REGISTER 
			url = 'http://localhost:3000/register'
		} else if(option==2) {
			// LOGIN 
			url = 'http://localhost:3000/login'
		} else {
			console.log('OUTRO STATE COMO OPTION')
			return
		}

		console.log(url)

		fetch( url,  {
			headers: {'Content-Type': 'application/json'},
			method: "POST", 
			body: JSON.stringify({ 
				nickname: nickname,
				password: password
			})  
		})
		.then( res => res.json() )
		.then( res => {
			// muda pra /chat
			console.log('aaaaaaaaaaa')
			// this.setState({ redirect: (<Redirect to="/chat" />) })
		})
		.catch( err => console.log(err))
	}

    changeOption(op){
        this.setState({ option: op })
    }

    returnOption(){
        switch(this.state.option){
            case 1: // Register
                return (
                    <React.Fragment>
                        <input type="text" placeholder="Nome Usuario"></input>
                        <input type="text" placeholder="Senha"></input>
                        <input type="text" placeholder="Repita a senha"></input>
						<button onClick={() => this.requestFromServer('Alone', 124)}>Chat</button>
                    </React.Fragment>
                )
            case 2: // Log In
                return (
                    <React.Fragment>
						<input type="text" placeholder="Nome"></input>
                        <input type="text" placeholder="Senha"></input>
                    </React.Fragment>
                )
            default: // Without click
                return (
                    <h1>Bem vindo =D</h1>
                )
        }
    }

    render(){
        return(
            <div className="WelcomeScreen">
                <section className="options-start">
					<button onClick={() => this.changeOption(1) } >New User</button>
                    <button onClick={() => this.changeOption(2) } >Log In</button>
                </section>
                <form className="forms">
                    {this.returnOption()}

					{/*Component that make redirect if the user make login
						It stays with null value most of time, until the requestFromServer changes its value, receiving response a of server*/}
					{this.state.redirect}
                </form>
            </div>
        )
    }
}
