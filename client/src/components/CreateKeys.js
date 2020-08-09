import React from 'react';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, TextArea, Grid } from 'semantic-ui-react'
import generateNewPair from '../cryptoTool/Crypto'

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
            const keys = await generateNewPair(this.state.name, this.state.email, this.state.secret_1);
            console.log(keys);
            this.setState({ private_key: keys.privateKeyArmored, public_key: keys.publicKeyArmored });
        }
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
                            onChange={event => this.setState({ name: event.target.value })}
                        />
                        <Form.Input
                            required
                            value={this.state.email}
                            label="Email"
                            onChange={event => this.setState({ email: event.target.value })}
                        />

                        <Form.Input
                            required
                            value={this.state.secret_1}
                            label="Secret phrase"
                            onChange={event => this.setState({ secret_1: event.target.value })}
                        />

                        <Form.Input
                            required
                            value={this.state.secret_2}
                            label="Secret phrase"
                            onChange={event => this.setState({ secret_2: event.target.value })}
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