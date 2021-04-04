import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import './WelcomeScreen.scss'


export default class WelcomeScreen extends React.Component{
    constructor(props){
        super(props)

        this.state = {
			form: {
				nickname: null,
				password: null,
				passwordConfirm: null
			},
            option: null,
			redirect: null // <Redirect to="/chat" />
            /* 
             * option...
             * 1 - NEW USER
             * 2 - LOG IN
             */
        }

		this.handleInputChange = this.handleInputChange.bind(this)
    }

	requestFromServer(event){

		event.preventDefault()

		// Get the dades on forms
		// this.setState({ redirect: (<Redirect to="/chat" />) })
		let nickname = this.state.form.nickname
		let password = this.state.form.password
		let passwordConfirm = this.state.form.passwordConfirm

		let url

		if(this.state.option==1){
			// REGISTER 
			url = 'http://localhost:3000/register'
		} else if(this.state.option==2) {
			// LOGIN 
			url = 'http://localhost:3000/login'
		} else {
			console.log('OUTRO STATE COMO OPTION')
			return
		}
			
		// both passoword space aren't equals
		if( (passwordConfirm !== password) && this.state.option==1 ){
			return
		}

		fetch( url,  {
			method: "POST", 
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ 
				nickname: nickname,
				password: password
			})  
		})
		.then( res => res.json() ) // Transforma a resposta de json para obj
		.then( res => {
			// muda pra /chat
			console.log(res)
			const token = res.token
			const registro = res.registro

			if (token) {
				localStorage.setItem("token", token)
				if (registro){
					this.setState({ redirect: (<Redirect to="/chat" />) })
				}
			}

		})
		.catch( err => console.log(err))
	}

    changeOption(op){
        this.setState({ option: op })
    }

 	handleInputChange(event) {
		const target = event.target;
        var value = target.value;
        const name = target.name;

	 	this.setState({ 
			form: { ...this.state.form, [name]: value }
		})
	 }


    returnOption(){
        switch(this.state.option){
            case 1: // Register
                return (
                    <React.Fragment>
                        <input type="text" name="nickname" onChange={this.handleInputChange} className="name-reg" 	   placeholder="Nome Usuario"></input>
                        <input type="text" name="password" onChange={this.handleInputChange} className="password-reg1" placeholder="Senha"></input>
                        <input type="text" name="passwordConfirm" onChange={this.handleInputChange} className="password-reg2" placeholder="Repita a senha"></input>
						<button onClick={(event) => this.requestFromServer(event)}>Chat</button>
                    </React.Fragment>
                )
            case 2: // Log In
                return (
                    <React.Fragment>
						<input type="text" name="nickname" onChange={this.handleInputChange} className="name-log" 	  placeholder="Nome"></input>
                        <input type="text" name="password" onChange={this.handleInputChange} className="password-log" placeholder="Senha"></input>
						<button onClick={(event) => this.requestFromServer(event)}>Chat</button>
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
				<form className="forms" >
                    {this.returnOption()}

					{/*Component that make redirect if the user make login
						It stays with null value most of time, until the requestFromServer changes its value, receiving response a of server*/}
					{this.state.redirect}
                </form>
            </div>
        )
    }
}
