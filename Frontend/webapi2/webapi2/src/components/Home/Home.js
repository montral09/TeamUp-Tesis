import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './Home.css';
import {Search} from '../Search/Search';
import {Navigation} from '../Navigation/Navigation';
 
const home = (props) => {
    return (
        <div >
            <Navigation/>
            <Search/>
        </div>
    )
}
 
export default home;