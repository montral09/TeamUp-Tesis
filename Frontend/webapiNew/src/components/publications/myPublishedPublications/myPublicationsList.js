import React, {Suspense} from 'react';
import Header from "../../header/header";
import { Link, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';

import MyPublicationTable from './myPublicationTable';

class MyPublicationsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingPubs : true,
            loadingSpaceTypes : true,
            publications : [],
            spaceTypes : []
        }
        this.loadMyPublications = this.loadMyPublications.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadSpaceTypes();
        this.loadMyPublications();
    }
    loadSpaceTypes() {
        try {
            fetch('https://localhost:44372/api/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {
                    this.setState({ spaceTypes: data.spaceTypes, loadingSpaceTypes: false })
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
    loadMyPublications(){
        try{
            try {
                fetch('https://localhost:44372/api/publisherSpaces', {
                    method: 'POST',
                    header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        "AccessToken": this.props.tokenObj.accesToken,
                        "AdminMail": this.props.userData.Mail                   
                    })
                }).then(response => response.json()).then(data => {
                    if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                        this.setState({ publications: data.Publications, loadingPubs: false })
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
            return;
            let dummyData = {
                "Publications": [
                    {
                        "IdPublication": 1,
                        "IdUser": 0,
                        "Mail": null,
                        "SpaceType": 4,
                        "CreationDate": "2019-10-20T11:23:00",
                        "Title": "Salon de eventos espectacular",
                        "Description": "Con vista al mar, incluye mozos, vajilla y luces",
                        "Location": {
                            "Latitude": -34.909397000,
                            "Longitude": -56.138561000
                        },
                        "Capacity": 200,
                        "VideoURL": "https://www.youtube.com/watch?v=CJ2FWYCJWGo",
                        "HourPrice": 200,
                        "DailyPrice": 2000,
                        "WeeklyPrice": 10000,
                        "MonthlyPrice": 50000,
                        "Availability": "El salon se puede alquilar todos los dias de la semana, desde las 08:00 hasta las 05:00",
                        "Facilities": [
                            1,
                            3,
                            6,
                            7
                        ],
                        "State": "NOT VALIDATED",
                        "Images": null,
                        "ImagesURL": [
                            "https://s3-eu-west-1.amazonaws.com/worktel.files/aaee923a-3c7a-4c1a-9db9-5bbc15c903b4.jpeg",
                            "https://s3-eu-west-1.amazonaws.com/worktel.files/a162187c-07b2-4c51-b77f-f12d00230474.jpg",
                            "https://s3-eu-west-1.amazonaws.com/worktel.files/1fd01252-22c5-4e25-8133-2998c524cf8e.JPG"
                        ]
                    }
                ],
                "responseCode": "SUCC_PUBLICATIONSOK"
             }
             this.setState({ publications: dummyData.Publications, loadingPubs:false });

        }catch(error){
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

    render() {
        const { login_status } = this.props;
        if (login_status != 'LOGGED_IN') return <Redirect to='/' />
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Mis Publicaciones</title>
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
                                                <div className="col-md-12">
                                                {(!this.state.loadingPubs && !this.state.loadingSpaceTypes) ?
                                                    (<MyPublicationTable  publications={this.state.publications} spaceTypes={this.state.spaceTypes} />)
                                                    : ( <p>LOADING</p>)
                                                }
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

export default connect(mapStateToProps)(MyPublicationsList);