import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AddPassword from './AddPassword';
import GetPassword from './GettPassword';
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const App = () => {
    return (
        <Container>
            <h1>Password pusher</h1>
            <BrowserRouter>
                <Route path="/addpassword" exac component={AddPassword} />
                <Route path="/getpassword/:url" exac component={GetPassword} />
            </BrowserRouter>
        </Container>
    );
}
export default App;