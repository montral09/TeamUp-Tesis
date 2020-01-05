import React from 'react';
import Header from "../../header/header";
import Footer from "../../footer/footer";
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';
import Filters from "./filters";
import './mega_filter.css';
import PublicationList from "./publicationList";
import PublicationGrid from "./publicationGrid";
import { withRouter } from "react-router";
import LoadingOverlay from 'react-loading-overlay';
import { callAPI } from '../../../services/common/genericFunctions';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual'
import { compose } from 'redux';
class MainPublications extends React.Component {
	constructor(props) {
        super(props);
        let {spacetype, capacity, city} = props.match.params;
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
            totalPublications : 10,
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
            generalError : false,
            facilitiesSelected : []
        };
    }

    onChange = (e) => {
        const targetId = e.target.id;
        this.setState({
            [targetId]: e.target.value
        }, () =>{
            if(targetId == "publicationsPerPage" || targetId == "currentPage" || targetId == "facilitiesSelected" || targetId == "spacetypeSelected"){
                this.startSearchMP();
            }
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
        this.loadInfraestructureMP();
        this.loadSpaceTypesMP();
    }

    redirectToPub= (id) =>{
        this.props.history.push('/publications/viewPublication/viewPublication/'+id);
    }

    startSearchMP= () => {
        var objApi = {};
        objApi.objToSend = {
            "SpaceType": this.state.spacetypeSelected,
            "Capacity": this.state.capacity,
            "State": "ACTIVE",
            "City": this.state.city,
            "PageNumber" : parseInt(this.state.currentPage)-1,
            "PublicationsPerPage": parseInt(this.state.publicationsPerPage)
        }
        if(this.state.facilitiesSelected.length > 0){
            objApi.objToSend.Facilities = this.state.facilitiesSelected;
        }
        objApi.fetchUrl = "api/publications";
        objApi.method = "POST";
        objApi.successMSG = {
            SUCC_PUBLICATIONSOK : '',
        };
        objApi.functionAfterSuccess = "startSearchMP";
        objApi.errorMSG= {}
        this.setState({ publicationsLoaded: false });
        callAPI(objApi, this);
    }

    loadInfraestructureMP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/facilities";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_FACILITIESOK : '',
        };
        objApi.functionAfterSuccess = "loadInfraestructureMP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    loadSpaceTypesMP = () => {
        var objApi = {};
        objApi.objToSend = {}
        objApi.fetchUrl = "api/spaceTypes";
        objApi.method = "GET";
        objApi.successMSG = {
            SUCC_SPACETYPESOK : '',
        };
        objApi.functionAfterSuccess = "loadSpaceTypesMP";
        objApi.errorMSG= {}
        callAPI(objApi, this);
    }

    render() {
        if (this.state.generalError) return <Redirect to='/error' />
        const { translate } = this.props;
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp | {translate('mainPublications_head')}</title>
                    <meta name="description" content={translate('mainPublications_head')} />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <LoadingOverlay
                    active={this.state.spaceTypesLoaded === true && this.state.publicationsLoaded === true ? false : true}
                    spinner
                    text={translate('loading_text_small')}
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
                                        <Filters facilitiesList = {this.state.facilities} spaceTypesList = {this.state.spaceTypes} 
                                            facilitiesSelected={this.state.facilitiesSelected} onChange={this.onChange}/>										
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
                                                                {translate('sortBy_w')}: 
																<select>
																	<option value="1">{translate('default_w')}</option>
																</select>
													        </div>
													        <div className="limit">
                                                                {translate('show_w')}: 	
																<select id="publicationsPerPage" onChange={this.onChange}>
                                                                    <option value="10">10</option>
																	<option value="30">30</option>
																	<option value="50">50</option>
																</select>
													        </div>
													    </div>
													</div>
													{parseInt(this.state.publications.length) === 0 ? (
														<p>{translate('elementsNotFound_w')}</p>
													) : (
														<>
															{this.state.product_list === 'product-list active' &&
																<div className={this.state.product_list}>
																	<PublicationList redirectToPub={this.redirectToPub} publications = {this.state.publications}/>
																</div>
															}

															{this.state.product_grid === 'product-grid active' &&
																<div className={this.state.product_grid}>
																	<PublicationGrid redirectToPub={this.redirectToPub} publications = {this.state.publications}/>
																</div>
															}

															<div className="row pagination-results">
																<div className="col-md-6 text-left">
																	<ul className="pagination">
                                                                        {this.state.pagination.map(page => {
																			return (
																				<li className={this.state.currentPage === page ? 'active' : ''} key={page}><a href="#pagination" onClick={() => this.onChange({target:{id:'currentPage',value:page}})}>{page}</a></li>
																			);
																		})}
																	</ul>
																</div>
																<div className="col-md-6 text-right">{translate('showing_w')} {this.state.publications.length} {translate('publications_w')} {translate('of_w')} {this.state.totalPublications}</div>
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
const enhance = compose(
    withRouter,
    withTranslate
)
export default enhance(MainPublications);