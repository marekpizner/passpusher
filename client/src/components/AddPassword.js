import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message } from 'semantic-ui-react'

class AddPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            file: '',
            url: '',
            max_views: 4,
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

        // console.log('Content of file2:' + file_data);
        const url = 'http://localhost:3001/addpassword/' + this.state.password + '/' + this.state.max_views + '/' + this.state.max_time;
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                if (data.error !== '') {
                    this.setState({ error: data.error, url: '' });
                } else {
                    const url = 'http://localhost:3000/getpassword/' + data.url;
                    this.setState({ url: url });
                    console.log('Return: ' + url);
                }
            })
        event.preventDefault();
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
                    <Form.Field>
                        <label>
                            Max views:
                        </label>
                        <InputRange
                            maxValue={10}
                            minValue={0}
                            value={this.state.max_views}
                            onChange={value => this.setState({ max_views: value })} />
                    </Form.Field>
                    <Form.Field>
                        <label>
                            Minutes to live:
                        </label>
                        <InputRange
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