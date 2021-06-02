import React from 'react'
import './ButtonAddContact.scss'

class AddContact extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			pin: ''
		}
	}

	render() {
		var input = document.querySelectorAll('#pin-input')[0]

		var icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-plus" viewBox="0 0 16 16"> <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/> <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/> </svg>

			return(
				<React.StrictMode>
					<div className="form">
						<div>
							<input type="search" placeholder="Add Contact: #" maxLength={4} onChange={ (e) => this.setState({pin: e.target.value }) }  />
							<button className="add-contact" onClick={()=>this.change()} onClick={ ()=> this.props.addContact(this.state.pin)} type="submit">{icon}</button>
						</div>
					</div>
				</React.StrictMode>
			)
	}
}

export default AddContact
