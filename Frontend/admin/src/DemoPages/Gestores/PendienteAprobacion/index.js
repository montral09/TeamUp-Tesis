import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Extra

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PageTitle from '../../../Layout/AppMain/PageTitle';


// Table

import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

export default class PendienteAprobacion extends React.Component {

    render() {

        return (
            <Fragment>
                    <PageTitle
                        heading="Regular Tables"
                        subheading="Tables are the backbone of almost all web applications."
                        icon="pe-7s-drawer icon-gradient bg-happy-itmeo"
                    />
                    <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                        <Row>
                        <Col lg="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Table with hover</CardTitle>
                                    <TableHover/>
                                </CardBody>
                            </Card>
                        </Col>
                        </Row>
                    </ReactCSSTransitionGroup>
                </Fragment>
        );
    }
}