import React from 'react';
import Header from "../../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import CreatePublicationStep1 from './createPublicationStep1';
import CreatePublicationStep2 from './createPublicationStep2';
import CreatePublicationStep3 from './createPublicationStep3';
import CreatePublicationStep4 from './createPublicationStep4';
import CreatePublicationStep5 from './createPublicationStep5';


class CreatePublication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 1,
            spaceTypes: [],
            isLoading: false,
            buttonIsDisable: false,
            spaceTypeSelect: "1",
            spaceName: "",
            description: "",
            locationText: "",
            geoLat: 0,
            geoLng: 0,
            availability: "",
            capacity: "",
            youtubeURL: "",
            facilities: [],
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
        this.validateStep = this.validateStep.bind(this);
        this._nextStep = this._nextStep.bind(this);
        this._previousStep = this._previousStep.bind(this);
        
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
                    if(this.state.spaceImages.length != 0 && this.state.geoLat != 0){
                        isValid = true;
                    }
                break;
                case 3:
                    if(this.state.HourPrice != 0 || this.state.DailyPrice != 0 || 
                        this.state.WeeklyPrice != 0 || this.state.MonthlyPrice != 0){
                        isValid = true;
                    }
                break;
                case 4:
                    isValid = true;
                break;
                case 5:
                    isValid = true;
                break;              
            }
        }catch(error){
            console.log("error: "+error);
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
            toast.error('Por favor complete los campos obligatorios ', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
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
                <button
                    className="btn btn-secondary"
                    type="button" onClick={this._previousStep}>
                    Atras
            </button>
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
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this._nextStep}>
                    Siguiente
            </button>
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
                <button
                    className="btn btn-primary float-right"
                    type="button" onClick={this.submitPublication} disabled= {this.state.buttonIsDisable}>
                    Finalizar&nbsp;&nbsp;
                    { this.state.isLoading &&  
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    }
                </button>
            )
        }
        // ...else render nothing
        return null;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
        this.loadInfraestructure();
        this.loadPremiumOptions();
    }

    onChange = (e) => {
        var targetValue = e.target.value;
        switch(e.target.id){
            case "facilitiesSelect":
                var options = e.target.options;
                var values = [];
                for (var i = 0, l = options.length; i < l; i++) {
                    if (options[i].selected) {
                        values.push(options[i].value);
                    }
                }
                targetValue = values;
                break;
        }
        this.setState({
            [e.target.id]: targetValue
        });
    }


    loadSpaceTypes() {
        try {
            fetch('https://localhost:44372/api/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {
                    this.setState({ spaceTypes: data.spaceTypes })
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
        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    loadInfraestructure() {
        try {
            fetch('https://localhost:44372/api/facilities').then(response => response.json()).then(data => {
                console.log("data:" + JSON.stringify(data));
                if (data.responseCode == "SUCC_FACILITIESOK") {
                    this.setState({ facilities: data.facilities });
                } else {
                    toast.error('Internal error', {
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
        } catch (error) {
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
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
            toast.error('Internal error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }
    // Validate if all the required inputs are inputted, returns true or false
    checkRequiredInputs() {
        let returnValue = true;
        let message = "";

        return returnValue;
    }

    submitPublication() {

        var objToSend = {
            "AccessToken": this.props.tokenObj.accesToken,
            "VOPublication": {
                "Mail": this.props.userData.Mail,
                "SpaceType": parseInt(this.state.spaceTypeSelect),
                "Title": this.state.spaceName,
                "Description": this.state.description,
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
        console.log(objToSend);

        this.setState({ isLoading: true, buttonIsDisable: true });
        fetch('https://localhost:44372/api/publication', {
            method: 'POST',
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },

            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            this.setState({ isLoading: false, buttonIsDisable: false });
            console.log("data:" + JSON.stringify(data));
            if (data.responseCode == "SUCC_PUBLICATIONCREATED") {
                toast.success('Su publicación ha sido enviada correctamente, revise su casilla de correo para más informacion. ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.props.history.push('/')
            } else {
                if (data.Message) {
                    toast.error('Hubo un error: ' + data.Message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                } else {
                    toast.error('Internal error', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
        }
        ).catch(error => {
            this.setState({ isLoading: false, buttonIsDisable: false });
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
        const { login_status } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Crear Espacio</title>
                    <meta name="description" content="---" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="pattern" >
                        <div>
                            <div className="row">
                                <div className="col-md-12 ">
                                    <div className="row">
                                        <div className="col-md-9 center-column" id="content">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="well">
                                                    </div>
                                                </div>
                                                <div className="col-md-9">
                                                    <CreatePublicationStep1 parentState={this.state} onChange={this.onChange} />
                                                    <CreatePublicationStep2 parentState={this.state} onChange={this.onChange} />
                                                    <CreatePublicationStep3 parentState={this.state} onChange={this.onChange} />
                                                    <CreatePublicationStep4 parentState={this.state} onChange={this.onChange} />
                                                    <CreatePublicationStep5 parentState={this.state} onChange={this.onChange} />

                                                    {this.previousButton}
                                                    {this.nextButton}
                                                    {this.endButton}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        login_status: state.loginData.login_status,
        tokenObj: state.loginData.tokenObj,
        userData: state.loginData.userData,
    }
}

export default connect(mapStateToProps)(CreatePublication);