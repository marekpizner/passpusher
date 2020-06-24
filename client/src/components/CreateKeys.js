import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, Checkbox, TextArea } from 'semantic-ui-react'
import axios from 'axios';

const openpgp = require('openpgp');

class CreateKeys extends React.Component {


    render() {
        return (
            <div>
                <h2>Create keys</h2>
            </div>
        )
    }

}
export default CreateKeys;