import React from 'react';

import UserProvider from './Chat/context/index'

import App from './Chat/App'

function Tudo(){
    return (
        <UserProvider>
            <App></App>
        </UserProvider>
    )
}

export default Tudo
