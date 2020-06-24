import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, Checkbox, TextArea } from 'semantic-ui-react'
import axios from 'axios';

const openpgp = require('openpgp');

// import * as openpgp from 'openpgp'

class AddPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            encrypted: false,
            password: '',
            url: '',
            max_views_check: false,
            max_views: 4,
            max_time_check: false,
            max_time: 1,
            errors: [],
            public_key: ``
        };
    }

    handleChangePassword = (event) => {
        this.setState({ password: event.target.value });
    }

    handleChangePublicKey = (event) => {
        this.setState({ public_key: event.target.value });
    }

    handleCopyToClipboard = (event) => {
        navigator.clipboard.writeText(this.state.url)
    }

    readyToSend() {
        if (this.state.password === '' ||
            this.state.password === undefined) {
            return false;
        }
        return true;
    }

    handleSubmit = async (event) => {
        var password = this.state.password;
        this.setState({ encrypted: false })

        if (this.state.public_key !== '') {
            this.setState({ encrypted: true })
            password = await this.encrypt(this.state.password);
        }

        if (this.readyToSend()) {
            const passwordToSend = {
                "encrypted": this.state.encrypted,
                "password": password,
                "max_views_check": this.state.max_views_check,
                "max_views": this.state.max_views,
                "max_time_check": this.state.max_time_check,
                "max_time": this.state.max_time
            }

            axios.post('http://localhost:3001/addpassword/', passwordToSend).then(res => {
                const response_data = res.data
                if (response_data.errors.length === undefined || response_data.errors.length === 0) {
                    const url = 'http://localhost:3000/getpassword/' + response_data.url;
                    this.setState({ url: url });
                } else {
                    this.setState({ errors: response_data.errors, url: '' });
                }
            });
        } else {
            this.setState({ errors: [...this.state.errors, 'Sending password to server!'] })
        }
        event.preventDefault();
    }

    async encrypt(text) {
        try {
            const publicKey = (await openpgp.key.readArmored(this.state.public_key.trim())).keys[0];
            const result = await openpgp.encrypt({
                message: openpgp.message.fromText(text),
                publicKeys: publicKey
            })
            return result.data;
        } catch (error) {
            this.setState({ errors: [...this.state.errors, 'Encrypting data is public key correct?'] })
            console.error(error);
        }
    }

    render() {
        var urlshover;
        if (this.state.url !== '') {
            urlshover = (
                <Form>
                    <Form.Field>
                        <label>Url to password:</label>
                        <a href={this.state.url}>{this.state.url}</a>
                        <Button content="Copy url to clipboard" onClick={this.handleCopyToClipboard} />
                    </Form.Field>
                </Form>
            )
        } else {
            if (this.state.errors.length !== 0) {
                urlshover = (
                    <Message negative>
                        <Message.Header>Error: {this.state.errors.join(',  ')}</Message.Header>
                    </Message>
                )
            }
        }

        return (
            <div>
                <Form onSubmit={this.handleSubmit} >
                    <h2>Add password</h2>
                    <Form.Input
                        label="Password"
                        value={this.state.password}
                        onChange={this.handleChangePassword}
                    />

                    <Form.Field >
                        <label>
                            Max views:
                        </label>
                        <Checkbox
                            toggle
                            onChange={() => this.setState({ max_views_check: !this.state.max_views_check })}
                        />
                        <InputRange
                            disabled={!this.state.max_views_check}
                            maxValue={10}
                            minValue={0}
                            value={this.state.max_views}
                            onChange={value => this.setState({ max_views: value })} />
                    </Form.Field>

                    <Form.Field>

                        <label>
                            Minutes to live:
                        </label>
                        <Checkbox
                            toggle
                            onChange={() => this.setState({ max_time_check: !this.state.max_time_check })}
                        />
                        <InputRange
                            disabled={!this.state.max_time_check}
                            maxValue={20}
                            minValue={1}
                            value={this.state.max_time}
                            onChange={value => this.setState({ max_time: value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>
                            Public key:
                    </label>
                        <Checkbox
                            toggle
                            onChange={() => this.setState({ encrypted: !this.state.encrypted })}
                        />

                        <TextArea
                            disabled={!this.state.encrypted}
                            value={this.state.public_key}
                            style={{ maxHeight: 200 }}
                            onChange={this.handleChangePublicKey}
                        />
                    </Form.Field>
                    <Form.Button content="Submit" />
                </Form >
                {urlshover}
            </div >
        )
    }
}
export default AddPassword;