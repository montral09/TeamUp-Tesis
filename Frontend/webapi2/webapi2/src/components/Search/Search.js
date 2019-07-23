import React, {Component} from 'react';
import './Search.css';
import Select from 'react-select';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Button } from 'react-bootstrap';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

 export class Search extends React.Component {
    state = {
        selectedOption: options[0],
        location: ''
      };

      handleLocation (text) {
        this.setState({ location: text.target.value })
    }
      handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log('Option selected:', selectedOption);
      };

      search() {
      }
     render() {
         const { selectedOption } = this.state;
         console.log(this.state);

         return (
             <div className='search-line'>
                <div className='space-types'>
                <Select 
                    value={selectedOption}
                    onChange={this.handleChange}
                    options={options}
                />
                </div>
                <Form className='location-field'>
                <FormGroup>
                    <Input type="location" placeholder="Ubicacion" onChange={(text) => { this.handleLocation(text) }} />
                </FormGroup>
                </Form>
                <Button onClick={() => { this.search() }}>Buscar</Button>
             </div>
         );
    } 
}
 
export default Search;