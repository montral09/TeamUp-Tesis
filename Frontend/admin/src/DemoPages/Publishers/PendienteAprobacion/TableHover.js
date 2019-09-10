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
      gestPendApr: [],
      apiState : 'Cargando'
    }
  }

  componentDidMount() {
    fetch('https://localhost:44372/api/publisher'
    ).then(response => response.json()).then(data => {
      if (data.responseCode == "SUCC_PUBLISHERSOK") {
        this.setState({ 'gestPendApr': data.voUsers, 'apiState':'No hay más elementos' })
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

  // This function will send to API one publisher to be approved
  approvePublisher(index) {
    this.submitPublisher([this.state.gestPendApr[index].Mail], index);
  };

  // This function will create the object to send to API
  mapPublisher(publisherObj){
    return publisherObj.Mail;
  }

  saveAll(){
    this.submitPublisher(this.state.gestPendApr.map(this.mapPublisher), null);
  }

  // This funciton will call the api
  submitPublisher(publishersEmails, index){
      fetch('https://localhost:44372/api/publisher', {
        method: 'PUT',
        header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

        body: JSON.stringify({
            Mails: publishersEmails
        })
    }).then(response => response.json()).then(data => {
        console.log("data:" + JSON.stringify(data));
        if (data.responseCode == "SUCC_PUBLISHERSOK") {
            let text = "Gestor aprobado correctamente";
            if(index == null){
              console.log("Prev State: "+JSON.stringify(this.state.gestPendApr))
              this.setState((state) => {
                  state.gestPendApr = [];
                return {
                  gestPendApr: state.gestPendApr,
                };
              },() =>{console.log("New State: "+JSON.stringify(this.state.gestPendApr))});
              text = "Gestores aprobados correctamente";
            }else{
              console.log("Prev State: "+JSON.stringify(this.state.gestPendApr))
              this.setState((state) => {
                  state.gestPendApr.splice(index,1);
                return {
                  gestPendApr: state.gestPendApr,
                };
              },() =>{console.log("New State: "+JSON.stringify(this.state.gestPendApr))});
            }
            toast.success(text, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            this.props.history.push('/publishers/pendienteaprobacion')
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
          {(this.state.gestPendApr.length > 0) ? this.state.gestPendApr.map((gest, index) => {
            gest.checkbox = false;
            return (
              <tr key={index}>
                <td>{gest.Name}</td>
                <td>{gest.LastName}</td>
                <td>{gest.Mail}</td>
                <td>{gest.Phone}</td>
                <td>{gest.Rut}</td>
                <td>{gest.RazonSocial}</td>
                <td>{gest.Address}</td>
                <a onClick={() => { this.approvePublisher(index) }}><i className="lnr-checkmark-circle"></i></a>
              </tr>
            )
          }) : <tr><td colSpan="7">{this.state.apiState}</td></tr>}
        </tbody>
        <div className="form-group mt-2">
          <button type="button" className="btn btn-outline-primary mr-2" onClick={() => {this.saveAll()}}>Aprobar todos</button>
        </div>
      </Table>

    );
  }
}
