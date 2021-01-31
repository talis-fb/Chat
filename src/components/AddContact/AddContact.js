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
        return(
            <div className="space-for-button">
                <button className="add-contact" onClick={()=>this.change()}>
                      Add Contact
                </button>

                <div className='space-pin' style={ {display: this.state.displayAddContact} }>
                    <div>
                        PIN: #<input ></input>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddContact