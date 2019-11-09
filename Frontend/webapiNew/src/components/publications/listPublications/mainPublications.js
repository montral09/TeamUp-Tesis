import React from 'react';
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { Helmet } from 'react-helmet';
//import BlockProducts from '../blocks/blockProducts'
import Filters from "./filters";
import './mega_filter.css';
//import PublicationList from "../publicationList";
import PublicationGrid from "./publicationGrid";
import { toast } from 'react-toastify';
import { withRouter } from "react-router";
import LoadingOverlay from 'react-loading-overlay';


class MainPublications extends React.Component {
	constructor(props) {
        super(props);
        let {spacetype, capacity, city} = props.match.params;
        this.state = { 
            grid: '', 
            list: 'active',
            product_list: 'product-list active', 
            product_grid: 'product-grid',
            publications : [],
            facilities : [],
            spaceTypes : [],
            spacetypeSelected : spacetype || "",
            capacity : capacity || "",
            city : city || "",
            totalPublications : 1,
            spaceTypesLoaded : false,
            publicationsLoaded : false,
        };
        this.loadDummyPublication = this.loadDummyPublication.bind(this);
        this.loadInfraestructure = this.loadInfraestructure.bind(this);		
        this.loadSpaceTypes = this.loadSpaceTypes.bind(this);
        this.startSearch = this.startSearch.bind(this);
        this.redirectToPub = this.redirectToPub.bind(this);

	}
	handleView(view) {
		if(true) {
			this.setState({ 
                grid: 'active', 
                list: '', 
                product_grid: 'product-grid active', 
                product_list: 'product-list' })
		} else if(view === 'list') {
			this.setState({ 
                list: 'active', 
                grid: '', 
                product_grid: 'product-grid', 
                product_list: 'product-list active' })
		}
    }
    
    componentDidMount() {
        window.scrollTo(0, 0);
        this.loadInfraestructure();
        this.loadSpaceTypes();
    }
    redirectToPub(id){
        this.props.history.push('/publications/viewPublication/viewPublication/'+id);
    }
    startSearch() {
        var objToSend = {}
        var fetchUrl = "https://localhost:44372/api/publications";
        var method = "POST";

        var objToSend = {
            "SpaceType": this.state.spacetypeSelected,
            "Capacity": this.state.capacity,
            "State": "ACTIVE",
            "City": this.state.city,
        }
        console.log("startSearch:");
        console.log(objToSend);
        this.setState({ publicationsLoaded: false });
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data.responseCode == "SUCC_PUBLICATIONSOK") {
                this.setState({ publicationsLoaded: true, publications:data.Publications, totalPublications:data.TotalPublications });
            } else {
                this.setState({ publicationsLoaded: true });
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
            this.setState({ publicationsLoaded: true });
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

    loadInfraestructure() {
        try {
            fetch('https://localhost:44372/api/facilities').then(response => response.json()).then(data => {
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

    loadDummyPublication () {
        var publications = [
            {
                "IdPublication": 6,
                "IdUser": 0,
                "Mail": null,
                "SpaceType": 3,
                "CreationDate": "2019-11-05T16:47:00",
                "Title": "IBM Uruguay",
                "Description": "Con vista al mar, incluye mozos, vajilla y luces",
                "Address": "Av Italia 6000",
                "City": "Pocitos",
                "Location": {
                    "Latitude": -34.909397000,
                    "Longitude": -56.138561000
                },
                "Capacity": 70,
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
                "State": null,
                "ImagesURL": [
                    "https://firebasestorage.googleapis.com/v0/b/teamup-1571186671227.appspot.com/o/Images%2F8%2F6%2F0.PNG?alt=media&token=c6b203fe-4eb8-4193-98d5-fc6b47bd7475"
                ],
                "QuantityRented": 4,
                "Reviews": [],
                "Ranking": 0
			},
			{
                "IdPublication": 7,
                "IdUser": 0,
                "Mail": null,
                "SpaceType": 3,
                "CreationDate": "2019-11-05T16:47:00",
                "Title": "IBM Uruguay",
                "Description": "Con vista al mar, incluye mozos, vajilla y luces",
                "Address": "Av Italia 6000",
                "City": "Pocitos",
                "Location": {
                    "Latitude": -34.909397000,
                    "Longitude": -56.138561000
                },
                "Capacity": 70,
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
                "State": null,
                "ImagesURL": [
                    "https://firebasestorage.googleapis.com/v0/b/teamup-1571186671227.appspot.com/o/Images%2F8%2F6%2F0.PNG?alt=media&token=c6b203fe-4eb8-4193-98d5-fc6b47bd7475"
                ],
                "QuantityRented": 4,
                "Reviews": [],
                "Ranking": 0 
			}
        ]

        this.setState({publications:publications});
    }

    loadSpaceTypes() {
        try {
            fetch('https://localhost:44372/api/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {
                    if(!this.state.spacetype){
                        var newSpaceTypeSelected = data.spaceTypes[0].Code;
                        this.setState({ spaceTypes: data.spaceTypes, spacetypeSelected: newSpaceTypeSelected, spaceTypesLoaded: true },
                                        () => {this.startSearch();})
                    }else{
                        this.setState({ spaceTypes: data.spaceTypes, spaceTypesLoaded: true },
                            () => {this.startSearch();})
                    }
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

    render() {
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | Lista de publicaciones</title>
                    <meta name="description" content="Lista de publicaciones" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <LoadingOverlay
                    active={this.state.spaceTypesLoaded === true && this.state.publicationsLoaded === true ? false : true}
                    spinner
                    text='Cargando...'
                    >

                    <div className="breadcrumb  full-width ">
                        <div className="background-breadcrumb"></div>
                        <div className="background">
                            <div className="shadow"></div>
                            <div className="pattern">
                                <div className="container">
                                    <div className="clearfix">
                                        <ul>
                                            <li>Listado de publicaciones</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-content  full-width">
                    <div className="background-content"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
								<div className="row">
									<div className="col-md-3 " id="column-left">
										<Filters facilitiesList = {this.state.facilities} spaceTypesList = {this.state.spaceTypes}/>										
									</div>

									<div className="col-md-9">
										<div className="row">
											<div className="col-md-12 center-column" id="content">
												<h1>Publicaciones</h1>
												<div id="mfilter-content-container">
													<div className="product-filter clearfix">
													    <div className="list-options">
													        <div className="sort">
													            Ordenar por: 
																<select>
																	<option value="1">Defecto</option>
																	<option value="2">Menor Precio</option>
																	<option value="3">Mayor Precio</option>
																</select>
													        </div>
													        <div className="limit">
													            Mostrar: 	
																<select >
                                                                    <option value="10">10</option>
																	<option value="25">25</option>
																	<option value="50">50</option>
																</select>
													        </div>
													    </div>
													</div>
													{parseInt(this.state.publications.length) === 0 ? (
														<p>No hay publicaciones</p>
													) : (
														<>
															{this.state.product_list === 'product-list active' &&
																<div className={this.state.product_list}>
																	<PublicationGrid redirectToPub={this.redirectToPub} publications = {this.state.publications}/>
																</div>
															}

															{this.state.product_grid === 'product-grid active' &&
																<div className={this.state.product_grid}>
																	<PublicationGrid publications = {this.state.publications}/>
																</div>
															}

															<div className="row pagination-results">
																<div className="col-md-6 text-left">
																	<ul className="pagination">
																		
																	</ul>
																</div>
																<div className="col-md-6 text-right">Mostrando {this.state.publications.length} publicaciones de {this.state.totalPublications}</div>
															</div>
														</>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
                            </div>
                        </div>
                    </div>
                </div>

                </LoadingOverlay>
                <Footer />
            </>
        );
    }
}

export default withRouter(MainPublications);