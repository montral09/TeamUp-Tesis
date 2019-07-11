import React from 'react';
import './Navigation.css';
import { Col, Navbar, Brand, Collapse, Link, Nav, NavItem } from 'react-bootstrap';


const navigation = (props) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Account-Owner</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Account-Owner</Nav.Link>
                    <Nav.Link href="#owner-list">Owner Actions</Nav.Link>
                    <Nav.Link href="#account-list">Owner Actions</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default navigation;