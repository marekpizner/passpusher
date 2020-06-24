import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, Checkbox, TextArea } from 'semantic-ui-react'
import axios from 'axios';

const openpgp = require('openpgp');

class EncryptDecrypt extends React.Component {


    render() {
        return (
            <div>
                <h2>Encrypt decrypt</h2>
            </div>
        )
    }

}
export default EncryptDecrypt;