import React, { Fragment } from 'react';
import { withTranslate } from 'react-redux-multilingual'
import { displayErrorMessage, displaySuccessMessage } from '../../../../services/common/genericFunctions'
import './upload.css';
import './drag_arrow.png';

class Upload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      spaceImages: [],
      tempFiles : [],
      loadedImages : props.loadedImages || []
    }
    this.getBase64 = this.getBase64.bind(this);
  }

  // Upload image functions
  maxSelectFile = (event) => {
    let files = event.target.files // create file object
    if ((this.state.spaceImages.length + this.state.loadedImages.length + files.length) > 7) {
      event.target.value = null // discard selected file
      displayErrorMessage(this.props.translate('createPub_upload_maxUploadTextError'));
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
    const types = ['image/png', 'image/jpeg']
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container   
        err += files[x].type + this.props.translate('myReservedSpacesList_custPay_errorMsg2');
      }
    };

    if (err !== '') { // if message not empty that mean has error 
      event.target.value = null // discard selected file
      displayErrorMessage(err);
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
        err += files[x].type + this.props.translate('myReservedSpacesList_custPay_errorMsg3');
      }
    };
    if (err !== '') {
      event.target.value = null
      displayErrorMessage(err);
      return false
    }

    return true;

  }

  // End Upload image functions
  onChange = (evt) => {
    if (this.maxSelectFile(evt) && this.checkMimeType(evt) && this.checkFileSize(evt)) {
      console.log(evt.target.files);
      this.setState({ spaceImages: [], tempFiles: evt.target.files}, () => {
        for(var i=0;i<this.state.tempFiles.length;i++){
          var file = this.state.tempFiles[i]; // FileList object
          this.getBase64(file);
        }
      });
      displaySuccessMessage(this.props.translate('createPub_upload_successMsg'));
    }
  }

  getBase64(file) {
    var f = file; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    const scope = this;
    reader.onload = (function(theFile) {
      return function(e) {
        var binaryData = e.target.result;
        //Converting Binary Data to base 64
        var base64String = window.btoa(binaryData);
        //showing file converted to base64
        const fileTypeArr = file.type.split('/');
        var fileObj = {
          Extension: fileTypeArr[1],
          Base64String: base64String
        };
        var newSpaceImages = [];
        if(scope.state){
          newSpaceImages = scope.state.spaceImages || [];
        }
        newSpaceImages.push(fileObj);
        scope.setState({spaceImages:newSpaceImages}, () => {
          scope.props.onChange({
            target : {id: "spaceImages", value: scope.state.spaceImages},
          });
        });
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f);
  }
  render() {
    return (
      <Fragment>
        <div className="form-group files">
          <label>{this.props.translate('createPub_upload_maxUploadText')} </label>
          <input type="file" name="file" className="form-control" multiple onChange={this.onChange} />
        </div>
      </Fragment>
    )
  }
}
export default withTranslate(Upload);