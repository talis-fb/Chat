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

		// both passoword space aren't equals on option of create user
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
				<React.Fragment>
					
					<InputGroup className="mb-3 name-log">
						<InputGroup.Prepend>
							<InputGroup.Text id="basic-addon1"> <img src={iconUser} /> </InputGroup.Text>
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
							<InputGroup.Text id="basic-addon1"> <img src={iconPassword} /> </InputGroup.Text>

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
							<InputGroup.Text id="basic-addon1"><img src={iconPassword} /></InputGroup.Text>
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
