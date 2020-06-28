
import React from 'react';
import { Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react'


export default class Header extends React.Component {

    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
        return (
            <Menu secondary>
                <Menu.Item
                    name='home'
                    as={Link}
                    to="/home"
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick} />

                <Menu.Item
                    name='create_keys'
                    as={Link}
                    to="/createkeys"
                    active={activeItem === 'create_keys'}
                    onClick={this.handleItemClick} />

                <Menu.Item
                    name='encrypt_decrypt'
                    as={Link}
                    to="/encrypdecrypt"
                    active={activeItem === 'encrypt_decrypt'}
                    onClick={this.handleItemClick} />

                <Menu.Item
                    name='add_password'
                    as={Link}
                    to="/addpassword"
                    active={activeItem === 'add_password'}
                    onClick={this.handleItemClick} />
            </Menu >
        )
    }
}
