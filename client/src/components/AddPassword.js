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
            password: '',
            file: '',
            url: '',
            max_views_check: true,
            max_views: 4,
            max_time_check: true,
            max_time: 1,
            error: '',
            public_key: ``
        };
    }

    handleChange = (event) => {
        this.setState({ password: event.target.value });
    }

    handleChangeFile = (event) => {
        this.setState({ file: event.target.files });
    }

    handleCopyToClipboard = (event) => {
        console.log('CLIboard')
        navigator.clipboard.writeText(this.state.url)
    }

    handleSubmit = async (event) => {
        var password = this.state.password;
        var encrypted = false;
        if (this.state.public_key !==''){
            encrypted=true;
            password = await this.encrypt(this.state.password);
        }
        
        if (password !== '' || password !== undefined){
            const passwordToSend = {
                "encrypted": encrypted,
                "password": password,
                "max_views_check": this.state.max_views_check,
                "max_views": this.state.max_views,
                "max_time_check": this.state.max_time_check,
                "max_time": this.state.max_time
            }

            axios.post('http://localhost:3001/addpassword/', passwordToSend).then(res => {
                const response_data = res.data
                console.log(res)
                if (response_data.error !== '') {
                    this.setState({ error: response_data.error, url: '' });
                } else {
                    const url = 'http://localhost:3000/getpassword/' + response_data.url;
                    this.setState({ url: url });
                    console.log('Return: ' + url);
                }
            });
        }
        event.preventDefault();
    }

    async encrypt(text){
        try {
            const publicKey = (await openpgp.key.readArmored(this.state.public_key.trim())).keys[0];             
            const result = await openpgp.encrypt({
                message: openpgp.message.fromText(text),
                publicKeys: publicKey
            })
            return result.data;
        } catch (error) {
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
            if (this.state.error !== '') {
                urlshover = (
                    <Message negative>
                        <Message.Header>Error: {this.state.error}</Message.Header>
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
                        onChange={this.handleChange}
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
                            disabled={this.state.max_views_check}
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
                            disabled={this.state.max_time_check}
                            maxValue={20}
                            minValue={1}
                            value={this.state.max_time}
                            onChange={value => this.setState({ max_time: value })} />
                    </Form.Field>
                    <Form.Field
                        style={{ maxHeight: 200 }}
                        control={TextArea}
                        value = {this.state.public_key}
                        onChange={value => this.setState({public_key: value.text })}
                        label='Public key'
                        />
                    <Form.Button content="Submit" />
                </Form >
                {urlshover}
            </div >
        )
    }
}
export default AddPassword;