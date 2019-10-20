import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import './upload.css';
import './drag_arrow.png';

class Upload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spaceImages: []
    }
  }

  // Upload image functions
  maxSelectFile = (event) => {
    let files = event.target.files // create file object
    if (files.length > 7) {
      event.target.value = null // discard selected file
      toast.error('El maximo de imagenes a subir son 7', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;

    }
    return true;
  }
  checkMimeType = (event) => {
    //getting file object
    let files = event.target.files
    //define message container
    let err = ''
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err += files[x].type + ' no es un formato soportado\n';
      }
    };

    if (err !== '') { // if message not same old that mean has error 
      event.target.value = null // discard selected file
      toast.error(err, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
    return true;

  }
  checkFileSize = (event) => {
    let files = event.target.files
    let size = 1500000;
    let err = "";
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err += files[x].type + ' es demasiado grande, por favor elija una imagen de menor tamaño\n';
      }
    };
    if (err !== '') {
      event.target.value = null
      toast.error(err, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false
    }

    return true;

  }
  // End Upload image functions
  onChange = (e) => {
    if (this.maxSelectFile(e) && this.checkMimeType(e) && this.checkFileSize(e)) {
      console.log(e.target.files);
      /*
      this.setState({
        spaceImages: e.target.files
      });
      let newE = {
        target : {
          id: "spaceImages",
          value: e.target.files
        }
      }
      this.props.onChange(newE);*/
      const arrFiles = Array.from(e.target.files);
      let file = arrFiles[0];
      let fileBase64 = '';
      this.getBase64(file, (result) => {
          fileBase64 = result;
      });
      /*const files = arrFiles.map((file, index) => {
            let document = getBase64()
          }
        return { file, id: index, document }
      });*/
      console.log(fileBase64);
    }

  }
  getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
    return document;
  }
  render() {
    return (
      <Fragment>
        <div className="form-group files">
          <label>Sube tus fotos (Máximo 7) </label>
          <input type="file" name="file" className="form-control" multiple onChange={this.onChange} />
        </div>
      </Fragment>
    )
  }
}
export default Upload;