import React from 'react';
import { Form, Button, Message, TextArea } from 'semantic-ui-react'
import decrypt from '../cryptoTool/Crypto'

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

    getPasswordFromuser = (event) => {
        return prompt('Please enter your password');
    }

    handleEncryptSumbit = async () => {
        const passphrase = this.getPasswordFromuser();
        const password = await decrypt(this.state.password, this.state.private_key, passphrase)
        this.setState({ encrypted: false, password: password })
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
                            onChange={event => this.setState({ private_key: event.target.value })}
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