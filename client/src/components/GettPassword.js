import React from 'react';
import { Form, Button, Message, TextArea } from 'semantic-ui-react'
const openpgp = require('openpgp');

class GetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = { url: props.match.params.url, encrypted: '', password: '', max_views: 0, error: '', private_key: `` };
    }

    handleSubmit = () => {
        navigator.clipboard.writeText(this.state.password)
    }
    
    getPasswordFromuser = (event) => {
        return prompt('Please enter your password');
    }

     handleEncryptSumbit = async() => {
       const password = await this.decrypt()
       this.setState({encrypted: false, password: password})
    }

    async decrypt(){
        try {
            const passphrase = this.getPasswordFromuser();
            const { keys: [privateKey] } = await openpgp.key.readArmored(this.state.private_key.trim());
            await privateKey.decrypt(passphrase);

            const result = await openpgp.decrypt({
                message: await openpgp.message.readArmored(this.state.password),              // parse armored message
                privateKeys: [privateKey]                                           // for decryption
            });

            return result.data;
        } catch (error) {
            console.error(error);
        }
    }

    componentDidMount() {
        const url = 'http://localhost:3001/getpassword/' + this.state.url;
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                this.setState({ encrypted: data.encrypted, password: data.password, max_views: data.max_views, error: data.error });
            })
    }

    render() {
        var content;
        if (this.state.error) {
            content = (
                <Message negative>
                    <Message.Header>Error: {this.state.error}</Message.Header>
                </Message>
            )
        } else if (this.state.encrypted){
            content = (
                <Form onSubmit={this.handleEncryptSumbit}>
                    <Form.Field>
                        <label>Password is: {this.state.password}</label>
                    </Form.Field>
                    <Form.Field>
                        <label>Number of views: {this.state.max_views}</label>
                    </Form.Field>
                    <Form.Field
                        style={{ maxHeight: 200 }}
                        control={TextArea}
                        value = {this.state.private_key}
                        onChange={value => this.setState({private_key: value.text })}
                        label='Add private key to decrypt in browser'
                        />
                    <Form.Button content="Decrypt" />
                </Form>
            )
        }
        else {
            content = (
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Password is: {this.state.password}</label>
                    </Form.Field>
                    <Form.Field>
                        <label>Number of views: {this.state.max_views}</label>
                    </Form.Field>
                    <Form.Field>
                        <Button content="Copy password to clipboard" />
                    </Form.Field>
                </Form>
            )
        }

        return (
            <div>
                <h2>Get password</h2>
                {content}
            </div>
        )
    }

}
export default GetPassword;