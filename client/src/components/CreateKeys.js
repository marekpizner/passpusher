import React from 'react';
import "react-input-range/lib/css/index.css";
import InputRange from 'react-input-range';
import { Form, Button, Message, Checkbox, TextArea, Grid } from 'semantic-ui-react'

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
            public_key: ''
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

    }

    onSubmit = async () => {
        if (this.valuesCheck) {
            const keys = await this.generateNewPair(this.state.name, this.state.email, this.state.secret_1);
            console.log(keys);
            this.setState({ private_key: keys.privateKeyArmored, public_key: keys.publicKeyArmored });
        }
    }

    async generateNewPair(name, email, secret) {
        const key = await openpgp.generateKey({
            userIds: [{ name: name, email: email }], // you can pass multiple user IDs
            rsaBits: 4096,                                              // RSA key size
            passphrase: secret           // protects the private key
        });
        return key;
    }


    render() {


        return (
            <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                    <Form onSubmit={this.onSubmit}>
                        <h2>Generate keys</h2>
                        <Form.Input
                            value={this.state.name}
                            label="Name"
                            onChange={this.onChangeName}
                        />
                        <Form.Input
                            value={this.state.email}
                            label="Email"
                            onChange={this.onChangeEmail}
                        />

                        <Form.Input
                            value={this.state.secret_1}
                            label="Secret phrase"
                            onChange={this.onChangeSecret_1}
                        />

                        <Form.Input
                            value={this.state.secret_2}
                            label="Secret phrase"
                            onChange={this.onChangeSecret_2}
                        />
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