import React from 'react'

import { Alert } from 'react-bootstrap'

export default (props) => <Alert variant="danger" > {props.log || props.text} </Alert>
	
