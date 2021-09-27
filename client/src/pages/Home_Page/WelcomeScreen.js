import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'

import './WelcomeScreen.scss'


function WelcomeScreen(props){
    const [ redirect, setRedirect ] = useState(null)
    const [ alert_error, setAlert_error ] = useState(null)
    const [ option, setOption ] = useState(null)
    const [ form, setForm ] = useState({
        nickname: null, 
        password:null, 
        passwordConfirm: null 
    })


    function changeOption(op){
        setOption(op)
        setAlert_error(null)
    }

    function returnPasswordConfirm(){
        if(option){
            return (
                <>
                    <h2>Senha novamente...</h2>
                    <input type="password" name="passwordConfirm" onChange={handleInputChange}/>
                </>
            ) 
        }
    }

    function handleInputChange(event) {
        const target = event.target;
        var value = target.value;
        const name = target.name;
        setForm({ ...form, [name]: value })
    }

    function requestFromServer(event){
        event.preventDefault()

        let url = ( option ) ? 'http://localhost:3000/register' : 'http://localhost:3000/login'

        // both passoword space aren't equals in option create user
        if( (form.passwordConfirm !== form.password) && option==true ){
            setAlert_error('Senha inseridas diferentes')
            return
        }

        fetch( url,  {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                nickname: form.nickname,
                password: form.password
            })  
        })
            .then( res => res.json() ) // Transforma a resposta de json para obj
            .then( res => {
                if( res.error ){
                    console.log('DEU ERRROO')
                    setAlert_error(res.error)
                    return
                }

                const token = res.token
                const user = JSON.stringify(res.user)

                if ( token && res.user ) {
                    localStorage.setItem("token", token)
                    localStorage.setItem("user", user)
                    // window.location.reload()
                }

            })
            .catch( err => console.log(err))
    }




    // gifs for stay on right side of container
    const cat1 = "https://media.tenor.com/images/3705aad154b22965c6723ac41e56415c/tenor.gif"
    const cat2 = "https://media.tenor.com/images/222c6f2036f7962461641aef91d56677/tenor.gif"
    return (
        <div className="WelcomeScreen">
            <main className="main">
                <section className="inputs">
                    <header className="mb-3">Chat-uTuVisse</header>

                    <form>
                        <h2>Username</h2>
                        <input type="text" name="nickname" onChange={handleInputChange}/>

                        <h2>Senha</h2>
                        <input type="password" name="password" onChange={handleInputChange}/>

                        {returnPasswordConfirm()}

                        { !!alert_error ? <Alert className="alert_error" variant="danger">{alert_error}</Alert> : '' }

                        <Button className="button-confirm" onClick={(event) => requestFromServer(event)} variant="success">CHAT</Button>
                    </form>

                    <div className="options">
                        <Button onClick={() => changeOption(true) } active={option}  variant="outline-warning" className="mb-3">Cadastro</Button>
                        <Button  onClick={() => changeOption(false) } active={!option} variant="outline-warning" className="mb-3">Login</Button>
                    </div>
                </section>

                <section className="art">
                    <img src={cat1} />
                </section>
            </main>

        </div>

    )
}

export default WelcomeScreen;
