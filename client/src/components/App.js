import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AddPassword from './AddPassword';
import GetPassword from './GettPassword';
import EncryptDecrypt from './EncryptDecrypt';
import CreateKeys from './CreateKeys';
import AboutMe from './AboutMe'
import Header from './Header'
import { Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const App = () => {
    return (
        <div>
            <Container>
                <BrowserRouter>
                    <Header />
                    {/* <Route path="/" exac component={AboutMe} /> */}
                    <Route path="/home" exac component={AboutMe} />
                    <Route path="/addpassword" exac component={AddPassword} />
                    <Route path="/getpassword/:url" exac component={GetPassword} />
                    <Route path="/encrypdecrypt" exac component={EncryptDecrypt} />
                    <Route path="/createkeys" exac component={CreateKeys} />
                </BrowserRouter>
            </Container>
        </div>
    );
}
export default App;