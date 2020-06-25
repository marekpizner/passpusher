import React from 'react';
import "react-input-range/lib/css/index.css";
import InputRange from 'react-input-range';
import { Form, Button, Message, Checkbox, TextArea } from 'semantic-ui-react'

const openpgp = require('openpgp');

class CreateKeys extends React.Component {

    async generateNewPair(name, email, secret) {

        const key = await openpgp.generateKey({
            userIds: [{ name: name, email: email }], // you can pass multiple user IDs
            rsaBits: 4096,                                              // RSA key size
            passphrase: secret           // protects the private key
        });
        return key
    }


    render() {
        return (
            <Form>
                <h2>Generate keys</h2>
                <Form.Input
                    label="Name"
                />
                <Form.Input
                    label="Email"
                />

                <Form.Input
                    label="Secret phrase"
                />

                <Form.Input
                    label="Secret phrase"
                />
            </Form>
        )
    }

}
export default CreateKeys;