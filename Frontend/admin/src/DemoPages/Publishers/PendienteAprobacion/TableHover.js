import React from 'react';
import { Table } from 'reactstrap';
import Checkbox from './Checkbox';

import {
  toast,
  Slide
} from 'react-toastify';

export default class TableHover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gestPendApr: []
    }
  }

  componentDidMount() {
    fetch('https://localhost:44372/api/publisher'
          ).then(response => response.json()).then(data => {
                //console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_PUBLISHERSOK") {
                    this.setState({ 'gestPendApr': data.voUsers })
                } else {
                    toast.error('Hubo un error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            ).catch(error => {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                console.log(error);
            }
            )
  }

  handleCheckboxChange(changeEvent){
    const { name } = changeEvent.target;
    console.log("name "+name);
    let prevState = this.state.gestPendApr[name].checkbox;
    //this.setState({ 'gestPendApr': data.voUsers })
    //this.state.gestPendApr[name].checkbox = !prevState;

  };

  handleFormSubmit(){
    this.state.gestPendApr.forEach(function(gest){
      console.log("gest: "+ JSON.stringify(gest))
    })

  };

  render() {
    return (
      <Table hover className="mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>RUT</th>
            <th>Razon Social</th>
            <th>Dirección</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
        { (this.state.gestPendApr.length > 0) ? this.state.gestPendApr.map( (gest, index) => {
          gest.checkbox = false;
           return (
            <tr key={ index }>
              <td>{ gest.Name }</td>
              <td>{ gest.LastName}</td>
              <td>{ gest.Mail }</td>
              <td>{ gest.Phone }</td>
              <td>{ gest.Rut }</td>
              <td>{ gest.RazonSocial }</td>
              <td>{ gest.Address }</td>
              <Checkbox
                label={index}
                isSelected={gest.checkbox}
                onCheckboxChange={this.handleCheckboxChange}
                key={index}
              />
            </tr>
          )
         }) : <tr><td colSpan="7">Cargando...</td></tr> }
        </tbody>
        <div className="form-group mt-2">
          <button type="button"className="btn btn-outline-primary mr-2">Seleccionar todos</button>
          <button type="button"className="btn btn-outline-primary mr-2">Deseleccionar All</button>
          <button type="button"className="btn btn-outline-primary mr-2" onClick={this.saveAll}>Guardar</button>
        </div>
      </Table>
      
    );
  }
}
