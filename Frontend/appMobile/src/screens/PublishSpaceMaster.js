import React, {Component} from 'react';
import { StyleSheet,Text,View,ScrollView,TouchableOpacity,ToastAndroid,Button} from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import PublishSpaceStep1 from './PublishSpaceStep1';
import PublishSpaceStep2 from './PublishSpaceStep2';
import PublishSpaceStep3 from './PublishSpaceStep3';
import PublishSpaceStep4 from './PublishSpaceStep4';
import PublishSpaceStep5 from './PublishSpaceStep5';
import LoadingOverlay from 'react-native-loading-spinner-overlay';

import MenuButton from '../components/MenuButton';
import Globals from '../Globals';

class PublishSpaceMaster extends Component {

    constructor(props) {
        super(props);
        var pubIsLoading = false;
        if(props.publicationID){
            pubIsLoading = true;
        }
        this.state = {
            publicationID: props.publicationID,
            pubIsLoading : pubIsLoading,
            imagesURL : [],
            currentStep: 1,
            spaceTypes: [],
            isLoading: false,
            buttonIsDisable: false,
            spaceTypeSelect: '',
            spaceName: "",
            description: "",
            locationText: "",
            city: "",
            geoLat: 0,
            geoLng: 0,
            availability: "",
            capacity: "",
            youtubeURL: "",
            facilities: [],
            facilitiesSelectCompuesta: [],
            facilitiesSelect: [],
            spaceImages: [],
            reservationTypes: [],
            premiumOptions: [],
            premiumOptionsSelected: [],
            HourPrice: 0,
            DailyPrice: 0,
            WeeklyPrice: 0,
            MonthlyPrice: 0,
            maxSteps: 5
        }
        this.submitPublication = this.submitPublication.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateStep = this.validateStep.bind(this);
        this._nextStep = this._nextStep.bind(this);
        this._previousStep = this._previousStep.bind(this);
        this.onSelectionsChange = this.onSelectionsChange.bind(this);
        this.onSelectionsSave = this.onSelectionsSave.bind(this);
        this.onSelectionsChangeSpace = this.onSelectionsChangeSpace.bind(this);
        this.onSelectionsChangeImages = this.onSelectionsChangeImages.bind(this);
    }

    loadPublication(pubID){
        try{
            this.setState({ pubIsLoading: true});
            fetch(Globals.baseURL + '/publication?idPublication='+pubID+'&mail=')
            .then(response => response.json())
            .then(data => {
                if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                    var pubObj = data.Publication;
                    this.setState({ pubIsLoading: false, spaceName:pubObj.Title, description:pubObj.Description,locationText:pubObj.Address,
                                    DailyPrice:pubObj.DailyPrice,HourPrice:pubObj.HourPrice,WeeklyPrice:pubObj.WeeklyPrice,MonthlyPrice:pubObj.MonthlyPrice,
                                    city:pubObj.City,geoLat:pubObj.Location.Latitude, geoLng:pubObj.Location.Longitude,facilitiesSelect:pubObj.Facilities,
                                    imagesURL:pubObj.ImagesURL,capacity:pubObj.Capacity,availability:pubObj.Availability,youtubeURL:pubObj.VideoURL});
                } else {
                    this.setState({ pubIsLoading: false});
                    if(data.responseCode == 'ERR_SPACENOTFOUND'){
                        ToastAndroid.showWithGravity(
                            'Espacio no encontrado',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }
                    if (data.Message) {
                        ToastAndroid.showWithGravity(
                            'Hubo un error: ' + data.Message,
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    } else {
                        ToastAndroid.showWithGravity(
                            'Internal error',
                            ToastAndroid.LONG,
                            ToastAndroid.CENTER,
                        );
                    }
                }
            }
            ).catch(error => {
                this.setState({ pubIsLoading: false, buttonIsDisable: false });
                ToastAndroid.showWithGravity(
                    'Internal error',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
            }
            )
        }catch(error){
            ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }
    }

    validateStep(){
        var isValid = false;
        try{
            switch(this.state.currentStep){
                case 1:
                    if(this.state.spaceName && this.state.capacity && this.state.availability){
                        isValid = true;
                    }
                break;
                case 2:
                    if(this.state.geoLat != 0){
                        isValid = true;
                    }
                break;
                case 3:
                    if(/*this.state.imagesURL.length != 0 ||*/ this.state.spaceImages.length != 0  ){
                        isValid = true;
                    }
                break;
                case 4:
                    if(this.state.HourPrice != 0 || this.state.DailyPrice != 0 || 
                        this.state.WeeklyPrice != 0 || this.state.MonthlyPrice != 0){
                        isValid = true;
                    }
                break;
                case 5:
                    isValid = true;
                break;              
            }
        }catch(error){
            
        }
        return isValid;
    }

    _nextStep() {
        if(this.validateStep() == true){
            let currentStep = this.state.currentStep;
            // If the current step is not the last one, then add one on "next" button click
            currentStep = currentStep >= (this.state.maxSteps - 1) ? this.state.maxSteps : currentStep + 1
            this.setState({
                currentStep: currentStep
            })
        }else{
            ToastAndroid.showWithGravity(
                'Por favor complete los campos obligatorios',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }

    }

    _previousStep() {
        let currentStep = this.state.currentStep
        // If the current step is 2 or 3, then subtract one on "previous" button click
        currentStep = currentStep <= 1 ? 1 : currentStep - 1
        this.setState({
            currentStep: currentStep
        })
    }

    // The "next" and "previous" button functions
    get previousButton() {
        let currentStep = this.state.currentStep;
        // If the current step is not 1, then render the "previous" button
        if (currentStep !== 1) {
            return (
                <TouchableOpacity style={styles.button} onPress={this._previousStep}> 
                    <Text style={styles.buttonText}>Atrás</Text>
                </TouchableOpacity>
            )
        }
        // ...else return nothing
        return null;
    }

    get nextButton() {
        let currentStep = this.state.currentStep;
        // If the current step is not the last step, then render the "next" button
        if (currentStep < this.state.maxSteps) {
            return (
                <TouchableOpacity style={styles.button} onPress={this._nextStep}> 
                    <Text style={styles.buttonText}>Siguiente</Text>
                </TouchableOpacity>
            )
        }
        // ...else render nothing
        return null;
    }

    get endButton() {
        let currentStep = this.state.currentStep;
        
        // If the current step is the last step, then render the "end" button
        if (currentStep === this.state.maxSteps) {
            return (
                <TouchableOpacity style={styles.button} onPress={this.submitPublication} disabled={this.state.buttonIsDisable}> 
                    <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
                //<button
                //    className="btn btn-primary float-right"
                //    type="button" onClick={this.submitPublication} disabled= {this.state.buttonIsDisable}>
                //    Finalizar&nbsp;&nbsp;
                //    { this.state.isLoading &&  
                //    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                 //   }
                //</button>
            )
        }
        // ...else render nothing
        return null;
    }

    componentDidMount() {
        this.getSpaceTypes();
        this.getInfraestructure();
        this.loadPremiumOptions();
        if(this.state.publicationID){
            this.loadPublication(this.state.publicationID);
        }
    }

    onChange (event){
        const {name, type, text} = event;
        let processedData = text;
        this.setState({[name]: processedData})
    }

    handleChange(name, value){
        this.setState({[name]: value})
    }

    onSelectionsChange = (facilitiesSelectCompuesta) => {
        // selectedFacilities is array of { label, value }
        this.setState({facilitiesSelectCompuesta})
        var newFacilities = [];
        facilitiesSelectCompuesta.map((y) => {
            return newFacilities.push(y.value)
        })
        this.setState({facilitiesSelect:newFacilities})
    }

    onSelectionsSave = (facilitiesSelectCompuesta) => {
        // selectedFacilities is array of { label, value }
        
    }

    onSelectionsChangeSpace = (itemValue,itemIndex) => {
        this.setState({spaceTypeSelect:itemValue})
    }

    onSelectionsChangeImages = (itemBase64, itemExt) => {
        var newSpaceImages = [];
        var Base64String = '';
        var imgObj = {
            Extension: 'jpeg',
            Base64String: itemBase64
        }
        newSpaceImages.push(imgObj);
        this.setState({spaceImages:newSpaceImages});
    }

    getSpaceTypes() {
        try {
            fetch(Globals.baseURL + '/spaceTypes')
            .then(response => response.json()).then(data => {
            
            if (data.responseCode == "SUCC_SPACETYPESOK") {
                this.setState({ spaceTypes: data.spaceTypes })
            } else {
                ToastAndroid.showWithGravity(
                'Hubo un error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                );
            }
            }
            ).catch(error => {
                ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                );
                
            }
            )
        } catch (error) {
            ToastAndroid.showWithGravity(
            'Internal error',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            );
           
        }
    }

    getInfraestructure() {
        try {
            fetch(Globals.baseURL + '/facilities')
            .then(response => response.json()).then(data => {
                
                if (data.responseCode == "SUCC_FACILITIESOK") {
                    this.setState({ facilities: data.facilities });
                    this.getInfraList()
                } else {
                ToastAndroid.showWithGravity(
                    'Hubo un error',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
                }
            }
            ).catch(error => {
            ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
            
            }
            )
        } catch (error) {
        ToastAndroid.showWithGravity(
            'Internal error',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
        );
        }
    }

    getInfraList() {
        var obj = {value: null, label: null}
        var newArray = []
        this.state.facilities.map((facility) => {
        return (obj = {value: facility.Code, label: facility.Description},
        newArray.push(obj) // Push the object
        );
        
        })
        this.setState({ facilities: newArray });
    }

    loadPremiumOptions() {
        try {
            // call API
            var dummyData = {
                premiumOptions: [
                    {
                        "Code": "premium1",
                        "Description": "Premium 1",
                        "Price": 100
                    },
                    {
                        "Code": "premium2",
                        "Description": "Premium 2",
                        "Price": 150
                    },
                    {
                        "Code": "premium3",
                        "Description": "Premium 3",
                        "Price": 200
                    }
                ],
                "responseCode": "SUCC_premiumOptionsOK"
            };
            this.setState({ premiumOptions: dummyData.premiumOptions });

        } catch (error) {
            ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
        }
    }
    // Validate if all the required inputs are inputted, returns true or false
    checkRequiredInputs() {
        let returnValue = true;
        let message = "";

        return returnValue;
    }

    submitPublication() {
        var objToSend = {}
        var fetchUrl = '';
        var method = '';

        if(this.state.publicationID){
            // this is an edit
            var objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "Publication": {
                    "IdPublication": this.state.publicationID,
                    "Mail": this.props.userData.Mail,
                    "SpaceType": parseInt(this.state.spaceTypeSelect),
                    "Title": this.state.spaceName,
                    "Description": this.state.description,
                    "Address": this.state.locationText,
                    "City": this.state.city,
                    "Location": {
                        "Latitude": this.state.geoLat,
                        "Longitude": this.state.geoLng
                    },
                    "Capacity": parseInt(this.state.capacity),
                    "VideoURL": this.state.youtubeURL,
                    "HourPrice": parseFloat(this.state.HourPrice),
                    "DailyPrice": parseFloat(this.state.DailyPrice),
                    "WeeklyPrice": parseFloat(this.state.WeeklyPrice),
                    "MonthlyPrice": parseFloat(this.state.MonthlyPrice),
                    "Availability": this.state.availability,
                    "Facilities": this.state.facilitiesSelect,
                },
                "Base64Images": this.state.spaceImages,
                "ImagesURL" : this.state.imagesURL
            }
            fetchUrl = Globals.baseURL + '/publications';
            method = "PUT";
        }else{
            fetchUrl = Globals.baseURL + '/publication';
            method = "POST";
            var objToSend = {
                "AccessToken": this.props.tokenObj.accesToken,
                "VOPublication": {
                    "Mail": this.props.userData.Mail,
                    "SpaceType": parseInt(this.state.spaceTypeSelect),
                    "Title": this.state.spaceName,
                    "Description": this.state.description,
                    "Address": this.state.locationText,
                    "City" : this.state.city,
                    "Location": {
                        "Latitude": this.state.geoLat,
                        "Longitude": this.state.geoLng
                    },
                    "Capacity": parseInt(this.state.capacity),
                    "VideoURL": this.state.youtubeURL,
                    "HourPrice": parseFloat(this.state.HourPrice),
                    "DailyPrice": parseFloat(this.state.DailyPrice),
                    "WeeklyPrice": parseFloat(this.state.WeeklyPrice),
                    "MonthlyPrice": parseFloat(this.state.MonthlyPrice),
                    "Availability": this.state.availability,
                    "Facilities": this.state.facilitiesSelect,
                },
                "Images": this.state.spaceImages
            }
        }

        

        this.setState({ isLoading: true, buttonIsDisable: true });
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            this.setState({ isLoading: false, buttonIsDisable: false });
            
            if (data.responseCode == "SUCC_PUBLICATIONCREATED" || data.responseCode == "SUCC_PUBLICATIONUPDATED" ) {
                ToastAndroid.showWithGravity(
                    'Su publicación ha sido enviada correctamente, revise su casilla de correo para más informacion.',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                );
                this.props.navigation.navigate('Home');
            } else {
                if (data.Message) {
                    ToastAndroid.showWithGravity(
                        'Hubo un error: ' + data.Message,
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                } else {
                    ToastAndroid.showWithGravity(
                        'Internal error',
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                    );
                }
            }
        }
        ).catch(error => {
            this.setState({ isLoading: false, buttonIsDisable: false });
            ToastAndroid.showWithGravity(
                'Internal error',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
            );
            
        }
        )
    }

    render() {
        const { login_status } = this.props;
        //if (login_status != 'LOGGED_IN') return this.props.navigation.navigate('Home')
        return (
            <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff', flex:1, onPress: () => this.props.navigation.openDrawer()}}
                    rightComponent={{ icon: 'home', color: '#fff', flex:1, onPress: () => this.props.navigation.navigate('Home')}}
                />
                
                {this.state.pubIsLoading == false ? (
                    <ScrollView vertical showsVerticalScrollIndicator={false}>
   
                            <PublishSpaceStep1 parentState={this.state} onChange={this.onChange} onSelectionsChange={this.onSelectionsChange} onSelectionsChangeSpace={this.onSelectionsChangeSpace} />
                            <PublishSpaceStep2 parentState={this.state} onChange={this.onChange} handleChange={this.handleChange}/>
                            <PublishSpaceStep3 parentState={this.state} onChange={this.onChange} onSelectionsChangeImages={this.onSelectionsChangeImages}/>
                            <PublishSpaceStep4 parentState={this.state} onChange={this.onChange} />
                            <PublishSpaceStep5 parentState={this.state} onChange={this.onChange} />
                        
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {this.previousButton}
                            {this.nextButton}
                            {this.endButton}
                        </View>
                        
                    </ScrollView>
                ) : (                
                    <LoadingOverlay
                        visible={!this.state.pubIsLoading}
                        textContent={'Cargando...'}
                    />
                )}
                
            </View> 
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    //justifyContent: 'center',
  },
  titleText:{
    fontSize: 24, 
    fontWeight: 'bold',
    color: "#FFF",
    marginTop: 10,
    marginBottom: 30,
    paddingTop: 10,
  },
  inputBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10
  },
  pickerBox: {
    width:300,
    backgroundColor:'rgba(255,255,255,0.3)',
    color:'#ffffff',
    marginVertical: 10
  },
  facilitiesText: {
    paddingHorizontal: 16,
    fontSize: 16,
    color:'#ffffff',
    marginVertical: 10,
  },
  button: {
    width:130,
    height:30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#0069c0',
    borderRadius: 15,
    marginVertical: 20,
    elevation: 3,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#ffffff'
  },
});

const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}

export default connect(mapStateToProps)(PublishSpaceMaster);