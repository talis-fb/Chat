import React from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import { InputGroup, FormControl, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'

import Svg_1 from './assets/group1_.svg'
import Svg_2 from './assets/group2_.svg'



const iconUsernameInput = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>`
const iconPasswordInput = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key-fill" viewBox="0 0 16 16"><path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`

import { Alert } from 'react-bootstrap'
//import 'bootstrap/dist/css/bootstrap.min.css';

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
			redirect: null, 
			alert_error: null,
            option: true
            /* 
             * option...
             * true - NEW USER
             * false - LOG IN
             */
        }

		this.handleInputChange = this.handleInputChange.bind(this)
    }

	requestFromServer(event){
		event.preventDefault()

		// Get the dades on forms
		let nickname = this.state.form.nickname
		let password = this.state.form.password
		let passwordConfirm = this.state.form.passwordConfirm

		let url

		if( this.state.option ){
			// REGISTER 
			url = 'http://localhost:3000/register'
		} else {
			// LOGIN 
			url = 'http://localhost:3000/login'
		}			

		// both passoword space aren't equals
		if( (passwordConfirm !== password) && this.state.option==true ){
			this.setState({ alert_error: 'Senha inseridas diferentes' })
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
			if( res.error ){
				console.log('DEU ERRROO')
				this.setState({ alert_error: res.error })
				return
			}

			const token = res.token
			const user = JSON.stringify(res.user)

			if (token && user) {
				localStorage.setItem("token", token)
				localStorage.setItem("user", user)
				this.setState({ redirect: (<Redirect to="/chat" />) })
			}

		})
		.catch( err => console.log(err))
	}

    changeOption(op){
		this.setState({ option: op, alert_error: null })
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
		if(this.state.option){
			return (
				<React.Fragment>
					
					<InputGroup className="mb-3 name-log">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">@</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							onChange={this.handleInputChange}
							name="nickname" 
							type="text"
							placeholder="Username"
							aria-label="Username"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>

					<InputGroup className="mb-3 name-log">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">@</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							onChange={this.handleInputChange}
							name="password" 
							type="password"
							placeholder="Senha"
							aria-label="Password"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>


					<InputGroup className="mb-3 name-log">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">@</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							onChange={this.handleInputChange}
							name="passwordConfirm" 
							type="password"
							placeholder="Repita a senha"
							aria-label="Username"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>

					{ !!this.state.alert_error ? <Alert className="alert_error" variant="danger">{this.state.alert_error}</Alert> : '' }


				</React.Fragment>
			)
		} else {
			return (
				<React.Fragment>

					<InputGroup className="mb-3 name-log">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">@</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							onChange={this.handleInputChange}
							name="nickname" 
							type="text"
							placeholder="Username"
							aria-label="Username"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>


					<InputGroup className="mb-3 name-log">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1">@</InputGroup.Text>
						</InputGroup.Prepend>
						<FormControl
							onChange={this.handleInputChange}
							name="password" 
							type="password"
							placeholder="Password"
							aria-label="Password"
							aria-describedby="basic-addon1"
						/>
					</InputGroup>

					{ !!this.state.alert_error ? <Alert className="alert_error" variant="danger">{this.state.alert_error}</Alert> : '' }

				</React.Fragment>
			)
		}
	}
    

	render(){

		console.log(this.state)

		return(
			<div className="WelcomeScreen">
				<main className="main">
					<header className="mb-3">Chat-uTuVisse</header>

					<form className="forms mb-3">
						{this.returnOption()}
						<Button className="button-confirm" onClick={(event) => this.requestFromServer(event)} variant="success">CHAT</Button>
					</form>

					<div className="options">
						<Button onClick={() => this.changeOption(true) } active={this.state.option}  variant="outline-warning" className="mb-3">Cadastro</Button>
						<Button  onClick={() => this.changeOption(false) } active={!this.state.option} variant="outline-warning" className="mb-3">Login</Button>
					</div>
				</main>

				<section className="art">
					<img src={Svg_2} />
				</section>
			</div>
		)
	}
}
