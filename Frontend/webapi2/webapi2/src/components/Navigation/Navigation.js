import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import './Navigation.css';
import { Col, Navbar, Brand, Collapse, Link, Nav, NavItem } from 'react-bootstrap';


export class Navigation extends Component {
    render() {
        return(            
                <Navbar className="navBar">
                <Navbar.Toggle />
                <Navbar.Collapse>
                <Nav className="justify-content-end nav" justify="true">
                <NavLink className= "navElements"
                    to="./">Team Up</NavLink>                
                    <NavLink className= "navElements"
                    to="./Login">Iniciar sesión</NavLink>
                    <NavLink className= "navElements"
                    to="/registrarUsuario">Registrarse</NavLink>
                </Nav>
                </Navbar.Collapse>
                </Navbar>                
        ) 
    }
}

export default Navigation;