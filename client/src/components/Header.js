
import React from 'react';
import { Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react'


const Header = () => {

    return (
        <Menu pointing>
            <Menu.Item as={Link} to="/home"> Home </Menu.Item>
            <Menu.Item as={Link} to="/createkeys">Create keys </Menu.Item>
            <Menu.Item as={Link} to="/encrypdecrypt"> Encrypt decrypt</Menu.Item>
            <Menu.Item as={Link} to="/addpassword">Push password</Menu.Item>
        </Menu>
    )
};

export default Header;