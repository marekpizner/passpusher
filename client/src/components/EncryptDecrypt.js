import React from 'react';
import "react-input-range/lib/css/index.css";
import { Form, Button, Label, TextArea } from 'semantic-ui-react'

const openpgp = require('openpgp');

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
        this.setState({ decrypted_message: await this.decrypt(this.state.message_private) })
    }

    onClickEncrypt = async () => {
        this.setState({ encrypted_message: await this.encrypt(this.state.message_public) })
    }

    async decrypt() {
        try {
            const passphrase = this.getPasswordFromuser();
            const { keys: [privateKey] } = await openpgp.key.readArmored(this.state.private_key.trim());
            await privateKey.decrypt(passphrase);

            console.log(this.state.message_private)
            console.log(privateKey)

            const result = await openpgp.decrypt({
                message: await openpgp.message.readArmored(this.state.message_private),
                privateKeys: [privateKey]
            });
            return result.data;
        } catch (error) {
            console.error(error);
        }
    }

    async encrypt() {
        try {
            const publicKey = (await openpgp.key.readArmored(this.state.public_key.trim())).keys[0];
            const result = await openpgp.encrypt({
                message: openpgp.message.fromText(this.state.message_public),
                publicKeys: publicKey
            })
            return result.data;
        } catch (error) {
            console.error(error);
        }
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