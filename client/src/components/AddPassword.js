import React from 'react';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";
import { Form, Button, Message, Checkbox, TextArea } from 'semantic-ui-react'
import axios from 'axios';
const openpgp = require('openpgp');



class AddPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            file: '',
            url: '',
            public_key: '',
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

        event.preventDefault();
    }

    async encrypt(text, public_key){
        await openpgp.initWorker({ path: 'openpgp.worker.js' });

        var publicKey = (await openpgp.key.readArmored(public_key.trim())).keys; 

        console.log(publicKey);
        
        const result = await openpgp.encrypt({
            message: openpgp.message.fromText(text),
            publicKeys: publicKey
        });
    console.log(result.data);
    }

    componentDidMount() {
        var public_key = `-----BEGIN PGP PUBLIC KEY BLOCK-----
        Version: Keybase OpenPGP v1.0.0
        Comment: https://keybase.io/crypto
        
        xo0EXu4eagEEAMDtxM4/r9utk2idqNXt9CbSF4jGdAS2e09uKppdcYvfnP2AbBc3
        Oqz9z402YebE0xUm7VJ0jx2I1kCWPiXiHrffv3EC/hIw1s8u5OTHDrYrnc3iyHfn
        gS7x2rCHJavfQ0u9i+pb3Co0PJXlUUtneNWllP9h3cVgXzswX5MrAZK9ABEBAAHN
        FWFzZGFzZCA8YWRzQGRzYWQuYXNkPsKtBBMBCgAXBQJe7h5qAhsvAwsJBwMVCggC
        HgECF4AACgkQIgss2ezuKW0axgQAtmLLSpTdxQ9NU8PmxAOWLpK7JBV0wIbOoS5l
        GTkbldFRlL1UTKz9UHy+hq9l8lMxBncVfn+plN4EdMyGmw9QP7joahV9Nfdhp7cT
        w3xbYGxz8FR3uJvCSXy83DvywDxPv6JFTxiKVsLf/1LmnF2yM80fbYvpICt19MNo
        /X8iNAvOjQRe7h5qAQQAs6rmx5D0fCYxGiNKQ+c9rSM7CUm9Wcp1kW1B34qWp+d/
        CJ2+7jwEKijXmoKtpx6YwFHwy4Jk4bC7ocIzIBZPyaOu/Ydx8lwh9BeZ9ZqVbJbw
        3zZE7RM6IJsqw6Z7ohXcj/9fsLwG4sdJRIyIpCRPoA2FO0LcXVcg3CKp5e3B4YUA
        EQEAAcLAgwQYAQoADwUCXu4eagUJDwmcAAIbLgCoCRAiCyzZ7O4pbZ0gBBkBCgAG
        BQJe7h5qAAoJEERpiPFLpxlpPz4D/3e8tQeehD9r89iuWTwSmedwM7geNgyMZ14/
        1rE13M+lYf7qDa3lG8cAfBAcvURg1b5Bb30JZkiiphNZmS/Baa43FrdQSwI3Rmqe
        1NF2KjDkNqzGW1vRQxmjyIVtYNu5a+xlKDbs5nupC1dd4f8BVGVNoXArijIiz0IS
        CC0OkdiVpX4EAKH8Wf5I6eIrpYB0NnGPpFwnHsrjrM1LcSDbKhAc7uAHTyXGXLnv
        NcKh+URgqDHUNfdtNlLxg7Lw46/xH0Z8+0DfLS38RQtDHrNdkvb4X2CbGg3Oaj0Z
        eRTKVJ0prNc0y7+Wkr7gW5Iv9H32E9Uj5DfBaFiZz2YZYGSDYGtSsQxuzo0EXu4e
        agEEAOnTuLcFLKfysZaNcODBASXGKi/8AHKnG46sJJIYmh6Oj0pVVUxMdHYNFRav
        lsxOsMR6LbenWA0DlMEQIWtWi/E2NxJy1DhjuIKSfXFtU7oNMTnq7KDZXnDLTAW3
        N7Njc2i5GRh3BlMTdtO96SjaznCOlBQS5Gv5HuLqZ0cuoKBDABEBAAHCwIMEGAEK
        AA8FAl7uHmoFCQ8JnAACGy4AqAkQIgss2ezuKW2dIAQZAQoABgUCXu4eagAKCRB1
        /NM8Vs1knmdcBADeLNyDxdyiQ2Ui8G0tOtxHktjc5xTVWEItNMSggGIh/b/KQXrM
        N917NZ8cD1zD4M7YhVy2C1MGvNnDDLV+d1JFgi2YlWD61osqn04Mw8YA6Twca9e/
        UEHdCHoePf6NHVxVX+d84G28AMgZX7PBEGQcQttf/f//clLCOdhIidj6wfqxA/4i
        HcW3e7Y+as2SohLLGrVuRGVwFAF2Iht10ri/JCsvLVZdLQWmfVXSDItP3OrqZmGz
        u7DczHs0iCg9bODfyeVZ7Mx0VALObXJPoqnVTUCqg0AQfCcdkQd60GoN2wKvGagc
        Q8GvVVANEHKJBjLhRdANbNGYOPybvhoDSr5Lp87/kg==
        =ZFzY
        -----END PGP PUBLIC KEY BLOCK-----
        `

        var text = 'Ahoj toto je text'
        this.encrypt(text, public_key);
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
                            value={this.state.max_views_check}
                            onChange={value => this.setState({ max_views_check: !this.state.max_views_check })}
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
                            value={this.state.max_time_check}
                            onChange={value => this.setState({ max_time_check: !this.state.max_time_check })}
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
                        onChange={value => this.setState({public_key: value })}
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