import React from 'react'
import './AddContact.scss'

class AddContact extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            displayAddContact: 'none'
        }
    }

    change(){
        if(this.state.displayAddContact=='Block'){
            this.setState({ displayAddContact:'none'})
        } else {
            this.setState({ displayAddContact:'Block'})
        }
    }

    render() {
        var input = document.querySelectorAll('#pin-input')[0]
        
        return(
            <div className="space-for-button">
                <button className="add-contact" onClick={()=>this.change()}>
                      Add Contact
                </button>

                <div className='space-pin' style={ {display: this.state.displayAddContact} }>
                    <div>
                        PIN: #<input id="pin-input" type="text" maxLength={4}></input><svg onClick={ ()=> this.props.addContact(input.value)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16"><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/></svg>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddContact