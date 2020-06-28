import React from 'react';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, TextArea, Grid } from 'semantic-ui-react'

const openpgp = require('openpgp');

class CreateKeys extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            secret_1: '',
            secret_2: '',
            private_key: '',
            public_key: '',
            errors: []
        };
    }

    onChangeName = (event) => {
        this.setState({ name: event.target.value })
    }
    onChangeEmail = (event) => {
        this.setState({ email: event.target.value })
    }
    onChangeSecret_1 = (event) => {
        this.setState({ secret_1: event.target.value })
    }
    onChangeSecret_2 = (event) => {
        this.setState({ secret_2: event.target.value })
    }

    valuesCheck = () => {
        var errors = [];
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
            errors.push('Wrong email!')
        }
        if (this.state.secret_1 === '') {
            errors.push('Secret is empty!');
        }
        if (this.state.secret_1 !== this.state.secret_2) {
            errors.push('Secrets do not match!');
        }

        if (errors.length === 0) {
            return true;
        } else {
            this.setState({ errors: errors })
            return false;
        }
    }

    onSubmit = async () => {
        if (this.valuesCheck()) {
            const keys = await this.generateNewPair(this.state.name, this.state.email, this.state.secret_1);
            console.log(keys);
            this.setState({ private_key: keys.privateKeyArmored, public_key: keys.publicKeyArmored });
        }
    }

    async generateNewPair(name, email, secret) {
        const key = await openpgp.generateKey({
            userIds: [{ name: name, email: email }],
            rsaBits: 4096,
            passphrase: secret
        });
        return key;
    }


    render() {

        var errors = ''
        if (this.state.errors.length !== 0) {
            errors = (
                <Message negative>
                    <Message.Header>Error: {this.state.errors}</Message.Header>
                </Message>)
        }

        return (
            <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    <Form onSubmit={this.onSubmit}>
                        <h2>Generate keys</h2>
                        <Form.Input
                            required
                            value={this.state.name}
                            label="Name"
                            onChange={this.onChangeName}
                        />
                        <Form.Input
                            required
                            value={this.state.email}
                            label="Email"
                            onChange={this.onChangeEmail}
                        />

                        <Form.Input
                            required
                            value={this.state.secret_1}
                            label="Secret phrase"
                            onChange={this.onChangeSecret_1}
                        />

                        <Form.Input
                            required
                            value={this.state.secret_2}
                            label="Secret phrase"
                            onChange={this.onChangeSecret_2}
                        />
                        {errors}
                        <Button>Generate</Button>
                    </Form>
                </Grid.Column>
                <Grid.Column verticalAlign='middle'>
                    <Grid.Row>
                        <Form>
                            <Form.Field>
                                <label>Private key:</label>
                                <TextArea
                                    value={this.state.private_key}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Row>
                    <Grid.Row>
                        <Form>
                            <Form.Field>
                                <label>Public key:</label>
                                <TextArea
                                    value={this.state.public_key}
                                />
                            </Form.Field>
                        </Form>
                    </Grid.Row>
                </Grid.Column>
            </Grid >

        )
    }

}
export default CreateKeys;