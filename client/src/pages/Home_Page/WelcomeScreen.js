import React from 'react'
import { Alert, InputGroup, FormControl, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'

import Svg_1 from './assets/group1_.svg'
import Svg_2 from './assets/group2_.svg'
import iconPassword from './assets/iconPasswordInput.svg'
import iconUser from './assets/iconUserInput.svg'
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
			option: false // TRUE - New User  ||  FALSE - LOG IN
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
		url = ( this.state.option ) ? 'http://localhost:3000/register' : 'http://localhost:3000/login'

		// both passoword space aren't equals in option create user
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

				if ( token && user ) {
					localStorage.setItem("token", token)
					localStorage.setItem("user", user)
					window.location.reload()
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
				<>
					<h2>Username</h2>
					<input type="text" />

					<h2>Senha</h2>
					<input type="password" onChange={this.handleInputChange}/>

					<h2>Senha novamente...</h2>
					<input type="password" onChange={this.handleInputChange}/>
					{ !!this.state.alert_error ? <Alert className="alert_error" variant="danger">{this.state.alert_error}</Alert> : '' }
				</>
			)
		} else {
			return (
				<>
					<h2>Username</h2>
					<input type="text" />

					<h2>Senha</h2>
					<input type="password" onChange={this.handleInputChange}/>
					{ !!this.state.alert_error ? <Alert className="alert_error" variant="danger">{this.state.alert_error}</Alert> : '' }
				</>
			)
		}
	}


	render(){
		const cat1 = "https://media.tenor.com/images/3705aad154b22965c6723ac41e56415c/tenor.gif"
		const cat2 = "https://media.tenor.com/images/222c6f2036f7962461641aef91d56677/tenor.gif"
		return(
			<div className="WelcomeScreen">
				<main className="main">
					<section className="inputs">
						<header className="mb-3">Chat-uTuVisse</header>

						<form>
							{this.returnOption()}
							<Button className="button-confirm" onClick={(event) => this.requestFromServer(event)} variant="success">CHAT</Button>
						</form>

						<div className="options">
							<Button onClick={() => this.changeOption(true) } active={this.state.option}  variant="outline-warning" className="mb-3">Cadastro</Button>
							<Button  onClick={() => this.changeOption(false) } active={!this.state.option} variant="outline-warning" className="mb-3">Login</Button>
						</div>
					</section>

					<section className="art">
						<img src={cat1} />
					</section>
				</main>

			</div>
		)
	}
}
