import React from 'react';
import { Form, Button, Message } from 'semantic-ui-react'

class GetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = { url: props.match.params.url, password: '', max_views: 0, error: '' };
        console.log(this.state.url)
    }

    handleSubmit = () => {
        navigator.clipboard.writeText(this.state.password)
    }

    componentDidMount() {
        const url = 'http://localhost:3001/getpassword/' + this.state.url;
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                this.setState({ password: data.password, max_views: data.max_views, error: data.error });
            })
    }

    render() {
        if (this.state.password === '' | this.state.password === undefined | this.state.max_views === 0) {
            var shower = (
                <Message negative>
                    <Message.Header>Error: {this.state.error}</Message.Header>
                </Message>
            )
        } else {
            var shower = (
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
                {shower}
            </div>
        )
    }

}
export default GetPassword;