import React from 'react'

import './WelcomeScreen.scss'

export default class WelcomeScreen extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            option: null 
            /* 
             * option...
             * 1 - NEW USER
             * 2 - LOG IN
             */
        }
    }

    changeOption(op){
        this.setState({ option: op })
    }

    returnOption(){
        switch(this.state.option){
            case 1:
                return (
                    <React.Fragment>
                        <input type="text" placeholder="Nome Usuario"></input>
                        <input type="text" placeholder="Senha"></input>
                        <input type="text" placeholder="Repita a senha"></input>
                    </React.Fragment>
                )
            case 2: 
                return (
                    <React.Fragment>
                        <input type="text" placeholder="Nome"></input>
                        <input type="text" placeholder="Senha"></input>
                    </React.Fragment>
                )
            default:
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
                </form>
            </div>
        )
    }
}