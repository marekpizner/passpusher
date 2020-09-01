import React from 'react';
import "react-input-range/lib/css/index.css";
import { Form, Button, Label, TextArea } from 'semantic-ui-react'
import Crypto from '../cryptoTool/Crypto'


class EncryptDecrypt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message_private: '',
            private_key: '',
            decrypted_message: false,

            message_public: '',
            public_key: '',
            encrypted_message: false
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

    onClickDecrypt = async () => {
        const passphrase = this.getPasswordFromuser();
        this.setState({ decrypted_message: await Crypto.decrypt(this.state.message_private, this.state.private_key, passphrase) })
    }

    onClickEncrypt = async () => {
        this.setState({ encrypted_message: await Crypto.encrypt(this.state.message_public, this.state.public_key) })
    }

    render() {
        console.log(this.state)
        var shower_decrypted_message = '';
        var shower_encrypted_message = '';

        if (this.state.decrypted_message) {
            shower_decrypted_message = (
                <Form.Field>
                    <label>Message is:</label>
                    <Label> {this.state.decrypted_message} </Label>
                </Form.Field>
            )
        }
        if (this.state.encrypted_message) {
            shower_encrypted_message = (
                <Form.Field>
                    <label>Encrypted message:</label>
                    <TextArea
                        disable
                        value={this.state.encrypted_message}
                    />
                </Form.Field>

            )
        }

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
                    <Button onClick={this.onClickDecrypt}>Decrypt</Button>
                    {shower_decrypted_message}

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
                    <Button onClick={this.onClickEncrypt}>Encrypt</Button>
                    {shower_encrypted_message}
                </Form>
            </div>
        )
    }

}
export default EncryptDecrypt;