import React from 'react';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, TextArea } from 'semantic-ui-react'

const openpgp = require('openpgp');

class EncryptDecrypt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message_private: '',
            private_key: '',

            message_public: '',
            public_key: ''
        }
    }

    getPasswordFromuser = (event) => {
        return prompt('Please enter your password');
    }

    handleChange = (evt) => {
        const value = evt.target.value;
        this.setState({
            ...this.state,
            [evt.target.name]: value
        });
    }

    async decrypt() {
        try {
            const passphrase = this.getPasswordFromuser();
            const { keys: [privateKey] } = await openpgp.key.readArmored(this.state.private_key.trim());
            await privateKey.decrypt(passphrase);

            const result = await openpgp.decrypt({
                message: await openpgp.message.readArmored(this.state.password),
                privateKeys: [privateKey]
            });
            return result.data;
        } catch (error) {
            console.error(error);
            // this.setState({ errors: [...this.state.errors, 'Wrong password or private key!'] })
        }
    }

    render() {
        return (
            <div>
                <h2>Encrypt decrypt</h2>
                <Form>
                    <Form.Field>
                        <label>Mesage:</label>
                        <TextArea
                            name='message_private'
                            value={this.state.message_private}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Private key:</label>
                        <TextArea
                            name='private_key'
                            value={this.state.private_key}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Button>Decrypt</Button>

                    <Form.Field>
                        <label>Mesage:</label>
                        <TextArea
                            name='message_public'
                            value={this.state.message_public}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Public key:</label>
                        <TextArea
                            name='public_key'
                            value={this.state.public_key}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Button>Encrypt</Button>
                </Form>
            </div>
        )
    }

}
export default EncryptDecrypt;