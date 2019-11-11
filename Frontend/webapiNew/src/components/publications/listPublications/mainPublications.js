import React from 'react';
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
//import BlockProducts from '../blocks/blockProducts'
import Filters from "./filters";
import './mega_filter.css';
import PublicationList from "./publicationList";
import PublicationGrid from "./publicationGrid";
import { toast } from 'react-toastify';
import { withRouter } from "react-router";
import LoadingOverlay from 'react-loading-overlay';
import ErrorBoundary from '../../generic/ErrorBoundary';

class MainPublications extends React.Component {
	constructor(props) {
        super(props);
        let {spacetype, capacity, city} = props.match.params;
        console.log("props.match.params")

        console.log(props.match.params)
        let grid,list,product_list,product_grid = "";
        if(localStorage.getItem('view') === 'list') {
			grid= ''; list= 'active'; product_list= 'product-list active'; product_grid= 'product-grid';
        }else{
            grid= 'active'; list= ''; product_list= 'product-list'; product_grid= 'product-grid active';
        }
        this.state = { 
            grid: '', 
            list: 'active',
            product_list: 'product-list active', 
            product_grid: 'product-grid',
            publications : [],
            facilities : [],
            spaceTypes : [],
            spacetypeSelected : spacetype == "empty" ? "" : spacetype,
            spaceTypeSelectedText : "",
            capacity : capacity == "empty" ? "" :capacity,
            city : city  == "empty" ? "" : city,
            totalPublications : 1,
            spaceTypesLoaded : false,
            publicationsLoaded : false,
            grid: grid, 
            list: list, 
            product_grid: product_grid, 
            product_list: product_list,
            currentPage : 1,
            totalPages : 1,
            publicationsPerPage : 10,
            pagination : [1],
            generalError : false
        };
        this.loadInfraestructure = this.loadInfraestructure.bind(this);		
        this.loadSpaceTypes = this.loadSpaceTypes.bind(this);
        this.startSearch = this.startSearch.bind(this);
        this.redirectToPub = this.redirectToPub.bind(this);
        this.changeFilters = this.changeFilters.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }
    handleErrors(error){
        this.setState({ generalError: true });
        console.log("ERROR:");
        console.log(error);
    }
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

	handleView(view) {
		localStorage.setItem("view", view);
		if(view === 'grid') {
			this.setState({ grid: 'active', list: '', product_grid: 'product-grid active', product_list: 'product-list' })
		} else if(view === 'list') {
			this.setState({ list: 'active', grid: '', product_grid: 'product-grid', product_list: 'product-list active' })
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
                let newTotalPages = parseInt(data.TotalPublications/this.state.publicationsPerPage);
                let newPagination = [];
                for(var i=1;i<newTotalPages;i++){
                    newPagination.push(i);
                }
                this.setState({ publicationsLoaded: true, publications:data.Publications, 
                    totalPublications:data.TotalPublications,totalPages:newTotalPages, pagination:newPagination });
            } else {
                this.handleErrors(data.responseCode || "Generic error");
            }
        }
        ).catch(error => {
            this.handleErrors(error);
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
                this.handleErrors(error || "Generic error");
            }
            )
        } catch (error) {
            this.handleErrors(error);
        }
    }

    loadSpaceTypes() {
        try {
            fetch('https://localhost:44372/api/spaceTypes'
            ).then(response => response.json()).then(data => {
                if (data.responseCode == "SUCC_SPACETYPESOK") {

                    if(this.state.spacetypeSelected == ""){
                        var newSpaceTypeSelected = data.spaceTypes[0].Code;
                        var spaceTypeSelectedText = data.spaceTypes.filter(function(st){
                            return parseInt(st.Code) === parseInt(newSpaceTypeSelected);
                        });
                        this.setState({ spaceTypes: data.spaceTypes, spacetypeSelected: newSpaceTypeSelected, spaceTypesLoaded: true, spaceTypeSelectedText: spaceTypeSelectedText[0].Description },
                                        () => {this.startSearch();})
                    }else{
                        let sts = this.state.spacetypeSelected;
                        var spaceTypeSelectedText = data.spaceTypes.filter(function(st){
                            return parseInt(st.Code) === parseInt(sts);
                        });
                        if(!spaceTypeSelectedText){
                            spaceTypeSelectedText = data.spaceTypes[0].Description;
                            this.setState({ spacetypeSelected: data.spaceTypes[0].Code})
                        }
                        this.setState({ spaceTypes: data.spaceTypes, spaceTypesLoaded: true, spaceTypeSelectedText: spaceTypeSelectedText[0].Description || "" },
                            () => {this.startSearch();})
                    }
                } else {
                    this.handleErrors(data.responseCode || "Generic error");

                }
            }
            ).catch(error => {
                this.handleErrors(error || "Generic error");

            }
            )
        } catch (error) {
            this.handleErrors(error || "Generic error");
        }
    }

    changeFilters(filter,value){
        console.log("filter:"+filter+",value:"+value)
        if(filter == "spacetypeSelected"){
            let sts = this.state.spacetypeSelected;
            var spaceTypeSelectedText = this.state.spaceTypes.filter(function(st){
                return parseInt(st.Code) === parseInt(sts);
            });
            this.setState({[filter]: value, spaceTypeSelectedText : spaceTypeSelectedText[0].Description }, () => {this.startSearch()});
        }

    }

    render() {
        if (this.state.generalError) return <Redirect to='/error' />
        return (
            <ErrorBoundary>
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
                                            <li>{this.state.spaceTypeSelectedText}</li>
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
										<Filters facilitiesList = {this.state.facilities} spaceTypesList = {this.state.spaceTypes} changeFilters={this.changeFilters}/>										
									</div>
									<div className="col-md-9">
										<div className="row">
											<div className="col-md-12 center-column" id="content">
												<h1>{this.state.spaceTypeSelectedText}</h1>
												<div id="mfilter-content-container">
													<div className="product-filter clearfix">
                                                        <div className="options">
                                                            <div className="button-group display" data-toggle="buttons-radio">
                                                                <button className={this.state.grid} onClick={() => this.handleView('grid')} id="grid" rel="tooltip" title="Grid"><i className="fa fa-th"></i></button> 
                                                                <button className={this.state.list} onClick={() => this.handleView('list')} id="list" rel="tooltip" title="List"><i className="fa fa-th-list"></i></button>
                                                            </div>
                                                        </div>
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
																<select id="publicationsPerPage" onChange={this.onChange}>
                                                                    <option value="10">10</option>
																	<option value="25">25</option>
																	<option value="50">50</option>
																</select>
													        </div>
													    </div>
													</div>
													{parseInt(this.state.publications.length) === 0 ? (
														<p>No se encontraron publicaciones</p>
													) : (
														<>
															{this.state.product_list === 'product-list active' &&
																<div className={this.state.product_list}>
																	<PublicationList redirectToPub={this.redirectToPub} publications = {this.state.publications}/>
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
                                                                        {this.state.pagination.map(page => {
																			return (
																				<li className={this.state.currentPage === page ? 'active' : ''} key={page}><a href="#pagination" onClick={() => alert("pagina "+page)}>{page}</a></li>
																			);
																		})}
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
            </ErrorBoundary>
        );
    }
}

export default withRouter(MainPublications);