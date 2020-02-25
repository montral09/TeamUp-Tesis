import React, { Fragment } from 'react';
import './pagination.css';
import { Col, FormGroup, Label, Input, Card, CardBody, Row, CardTitle } from 'reactstrap';

/* Common components that builds the filters */
class Filters extends React.Component {
    constructor(props) {
        super(props);
        var testFilterOptions = [
            {
                OptionText: 'Estado pago',
                PropertyToMatch: 'CommissionState',
                Options: [
                    {
                        Text: "Pediente de pago",
                        Value: "PENDING PAYMENT"
                    },
                    {
                        Text: "Pago",
                        Value: "PAID"
                    }
                ]
            }
        ]
        this.state = {
            currentFilter: '',
            filterOptions: testFilterOptions,//props.filterOptions || []
            filteredArray : props.filteredArray
        }
    }
    onChangeSelect = (event) => {
        alert("Pendiente...")
        console.log(event.target.value)
        console.log(event.target.id)
    }

    render() {
        return (
            <Fragment>
                <Card className="main-card mb-12">
                    <CardBody>
                        <CardTitle>Filtros</CardTitle>
                        <Row>
                            {this.state.filterOptions.map(filterOption => {
                                return (
                                    <Col md="3" key={filterOption.OptionText}>
                                        <FormGroup>
                                            <Label for={filterOption.PropertyToMatch}>{filterOption.OptionText}</Label>
                                            <Input type='select' id={filterOption.PropertyToMatch} onChange = {this.onChangeSelect}>
                                                {filterOption.Options.map(option => {
                                                    return (
                                                        <option key={option.Value} value={option.Value}> {option.Text} </option>
                                                )})}
                                            </Input >
                                        </FormGroup>
                                    </Col>
                                );
                            })}
                        </Row>
                    </CardBody>
                </Card>
            </Fragment>
        );
    }
}


export default Filters;