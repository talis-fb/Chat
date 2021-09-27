import React from 'react';

import App from './App'

// Contexts
import UserProvider from './context/UserContext'
import SocketProvider from './context/SocketContext'

function index(){
    return (
        <UserProvider>
            <SocketProvider>
                <App />
            </SocketProvider>
        </UserProvider>
    )
}
export default index
