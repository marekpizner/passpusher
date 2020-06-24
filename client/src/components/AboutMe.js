import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, Checkbox, TextArea } from 'semantic-ui-react'
import axios from 'axios';

const openpgp = require('openpgp');

class AboutMe extends React.Component {


    render() {
        return (
            <div>
                <h2>Hi I'm Marek Pizner</h2>
            </div>
        )
    }

}
export default AboutMe;