import React from 'react';
import { Form, Button, Message, TextArea } from 'semantic-ui-react'
const openpgp = require('openpgp');

class GetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: props.match.params.url,
            encrypted: '',
            password: '',
            max_views_check: false,
            max_views: 0,
            errors: [],
            default_error: 'Something is wrong!',
            private_key: ``
        };
    }

    handleSubmit = () => {
        navigator.clipboard.writeText(this.state.password)
    }

    hancleChangePrivatekey = (event) => {
        this.setState({ private_key: event.target.value });
    }

    getPasswordFromuser = (event) => {
        return prompt('Please enter your password');
    }

    handleEncryptSumbit = async () => {
        const password = await this.decrypt()
        this.setState({ encrypted: false, password: password })
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

    componentDidMount() {
        const url = 'http://localhost:3001/getpassword/' + this.state.url;
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.setState({
                    encrypted: data.encrypted,
                    password: data.password,
                    max_views_check: data.max_views_check,
                    max_views: data.max_views,
                    errors: data.errors
                });
            })
    }

    getNumberOfViews() {
        if (this.state.max_views_check === false) {
            return '';
        } else {
            return (
                <Form.Field>
                    <label>Number of views: {this.state.max_views}</label>
                </Form.Field>
            )
        }
    }

    render() {
        console.log(this.state)
        var content;

        var number_of_views_content = this.getNumberOfViews();


        if (this.state.errors === undefined || this.state.errors.lengt === 0) {
            if (this.state.encrypted) {
                content = (
                    <Form onSubmit={this.handleEncryptSumbit}>
                        <Form.Field>
                            <label>Password is: </label>
                            {this.state.password}
                        </Form.Field>
                        {number_of_views_content}
                        <Form.Field
                            style={{ maxHeight: 200 }}
                            control={TextArea}
                            value={this.state.private_key}
                            onChange={this.hancleChangePrivatekey}
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
                        {number_of_views_content}
                        <Form.Field>
                            <Button content="Copy password to clipboard" />
                        </Form.Field>
                    </Form>
                )
            }
        } else {
            content = (
                <Message negative>
                    <Message.Header>Error: {this.state.errors}</Message.Header>
                </Message>
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