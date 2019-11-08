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


class MainPublications extends React.Component {
	constructor(props) {
        super(props);
        const {spacetype, capacity, city} = props.match.params;
        console.log("props.match.params");
        console.log(props.match.params);
        this.state = { 
            grid: '', 
            list: 'active',
            product_list: 'product-list active', 
            product_grid: 'product-grid',
            publications : [],
            spacetype : spacetype,
            capacity : capacity,
            city : city,
            totalPublications : 1,
            maxPublicationsPerPage : 10,
            showPublicationsPerPage : []
        };
        this.loadDummyPublication = this.loadDummyPublication.bind(this)		
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
        this.loadDummyPublication();
    }

    startSearch() {
        var objToSend = {}
        var fetchUrl = "https://localhost:44372/api/publications";
        var method = "POST";

        var objToSend = {
            "SpaceType": this.state.spacetype,
            "Capacity": this.state.capacity,
            "State": "ACTIVE",
            "City": this.state.city,
        }
        
        console.log(objToSend);

        this.setState({ isLoading: true, buttonIsDisable: true });
        fetch(fetchUrl, {
            method: method,
            header: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(objToSend)
        }).then(response => response.json()).then(data => {
            this.setState({ isLoading: false, buttonIsDisable: false });
            console.log("startSearch:");
            console.log(data);

            if (data.responseCode == "SUCC_PUBLICATIONSOK") {

            } else {
                toast.error('Internal error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                this.props.history.push('/publications/listPublications/mainPublications');

            }
        }
        ).catch(error => {
            this.props.history.push('/publications/listPublications/mainPublications');
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
        var maxPPP = parseInt(this.state.totalPublications/this.state.maxPublicationsPerPage);
        var optionsmaxpp = [10];

        if(this.state.totalPublications>10 ){
            for(var i=1;i<=maxPPP;i++){
                optionsmaxpp.push(i*this.state.maxPublicationsPerPage);
            }
        }

        this.setState({ showPublicationsPerPage: optionsmaxpp, publications:publications});
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
                <div className="breadcrumb  full-width ">
                    <div className="background-breadcrumb"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="clearfix">
                                    <ul>
                                        <li>Publicaciones</li>
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
										<Filters />										
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
                                                                    {this.state.showPublicationsPerPage.map(function(val){
                                                                       return ( <option value={val}>{val}</option> )
                                                                    })}
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
																	<PublicationGrid publications = {this.state.publications}/>
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
                <Footer />
            </>
        );
    }
}

export default withRouter(MainPublications);