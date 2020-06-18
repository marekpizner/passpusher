import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, Checkbox } from 'semantic-ui-react'
import openpgp from 'openpgp';
import axios from 'axios';

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
            error: ''
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

    handleSubmit = (event) => {
        let fileReader = new FileReader();
        if (this.state.file !== '') {
            let rsa_key_pub = '';

            fileReader.onload = (e) => {
                rsa_key_pub = e.target.result;
                console.log('Content of file1:' + rsa_key_pub);
            }
            fileReader.readAsText(this.state.file[0]);
        }

        const passwordToSend = {
            "password": this.state.password,
            "max_views_check": true,
            "max_views": this.state.max_views,
            "max_time_check": true,
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

        event.preventDefault();
    }

    async componentDidMount() {
        // await openpgp.initWorker({ path: 'openpgp.worker.js' });
        // (async () => {
        //     const { privateKeyArmored, publicKeyArmored, revocationCertificate } = await openpgp.generateKey({
        //         userIds: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        //         curve: 'ed25519',                                           // ECC curve name
        //         passphrase: 'super long and hard to guess secret'           // protects the private key
        //     });

        //     console.log(privateKeyArmored);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
        //     console.log(publicKeyArmored);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
        //     console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
        // })();
        // await openpgp.destroyWorker();
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
                <Form onSubmit={this.handleSubmit}>
                    <h2>Add password</h2>
                    <Form.Input
                        label="Password"
                        value={this.state.password}
                        onChange={this.handleChange}
                    />

                    <Form.Field >
                        <Checkbox 
                            toggle
                            value={this.state.max_views_check}
                            onChange={value => this.setState({ max_views_check: !this.state.max_views_check })}
                        />
                        <label>
                            Max views:
                        </label>
                        <InputRange
                            disabled={this.state.max_views_check}
                            maxValue={10}
                            minValue={0}
                            value={this.state.max_views}
                            onChange={value => this.setState({ max_views: value })} />
                    </Form.Field>

                    <Form.Field>
                    <Checkbox 
                            toggle
                            value={this.state.max_time_check}
                            onChange={value => this.setState({ max_time_check: !this.state.max_time_check })}
                        />
                        <label>
                            Minutes to live:
                        </label>
                        <InputRange
                            disabled={this.state.max_time_check}
                            maxValue={20}
                            minValue={1}
                            value={this.state.max_time}
                            onChange={value => this.setState({ max_time: value })} />
                    </Form.Field>
                    <Form.Button content="Submit" />
                </Form >
                {urlshover}
            </div >
        )
    }
}
export default AddPassword;