import React from 'react';
import $ from 'jquery';
import { withRouter } from "react-router";
import { compose } from 'redux';
// Multilanguage
import { withTranslate } from 'react-redux-multilingual';
import {
	InputGroup,
	InputGroupAddon,
	Input,
	Button
   } from 'reactstrap';

class Filters extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
		   newCapacity : this.props.capacitySelected || "",
		   newLocation : this.props.locationSelected || ""
        };
	}
	
	componentDidMount() {
		$(".open-filter").click(function () {
			$(".aside, .close-aside-box").addClass("active");
			$("body").css("overflow", "hidden");
		});

		$(".close-aside-box, .close-aside-box2").click(function () {
			$(".aside, .close-aside-box").removeClass("active");
			$("body").css("overflow", "visible");
		});
	}
	
	// This function will handle the onchange event from the fields
	onChange = (e) => {
		this.setState({
			[e.target.id]: e.target.value
		})
	}
	// This function will handle capacity change
	handleCapacityChange = (capacity) => {
		this.props.onChange({target:{id:'capacity',value:capacity}})
	}
	// This function will handle location change
	handleLocationChange = (location) => {
		this.props.onChange({target:{id:'city',value:location}})
	}
	
	// This function will handle the checkbox behavior
	handleCheckbox(facilityCode){
		var facilityIndex = this.props.facilitiesSelected.indexOf(facilityCode);
		var newFacilitySelectArr = this.props.facilitiesSelected;
		if(facilityIndex == -1){
			// this means -> check
			newFacilitySelectArr.push(facilityCode);
		}else{
			// this means -> uncheck
			newFacilitySelectArr.splice(facilityIndex,1);
		}
		this.props.onChange({target:{id:'facilitiesSelected',value:newFacilitySelectArr}});
	}
	// This function will handle the onclick behavior
	onClick(spaceCode,spaceDescription){
		this.props.onChange({target:{id:'spacetypeSelected',value:spaceCode}})
		this.props.onChange({target:{id:'spaceTypeSelectedText',value:spaceDescription}})		
	}
 	render() { 	
		const { translate } = this.props;
		return (
			<>
				<div className="box box-with-categories" id="mfilter-box-32">
					<h3 className="box-heading">{translate('filters_w')}</h3>
					<div className="box-content mfilter-content">
						<ul>
							<li className="mfilter-filter-item mfilter-tree mfilter-categories">
								<div className="mfilter-heading">
									<div className="mfilter-heading-content">
										<div className="mfilter-heading-text">
											<span>{translate('spaceType_w')}</span>
										</div>
										<i className="mfilter-head-icon"></i>
									</div>
								</div>
								<div className="mfilter-content-opts">
									<div className="mfilter-opts-container">
										<div className="mfilter-content-wrapper mfilter-iscroll scroll-content scroll-wrapper mfilter-scroll-standard">
											<div className="mfilter-options">
												<div className="mfilter-category mfilter-category-tree">
													<input type="hidden" name="path" value="mp3-players" />
													<ul className="mfilter-tb" data-top-url="" data-top-path="0">
														{this.props.spaceTypesList.map(spaceType => {
															return (
																<li className="mfilter-tb-as-tr" key={spaceType.Code+spaceType.Description} >
																	<div className="mfilter-tb-as-td" key={spaceType.Code*3+spaceType.Description}>
																		<a href="#category" onClick={() => this.onClick(spaceType.Code,spaceType.Description)}>{spaceType.Description}</a>
																	</div>
																</li>
															);
														})}
													</ul>
												</div>
											</div>
										</div>

										<div className="mfilter-clearfix"></div>
									</div>

									<div className="mfilter-clearfix"></div>
								</div>
							</li>
							<li className="mfilter-filter-item mfilter-tree mfilter-categories">
								<div className="mfilter-heading">
									<div className="mfilter-heading-content">
										<div className="mfilter-heading-text">
											<span>{translate('capacity_w')}</span>
										</div>
										<i className="mfilter-head-icon"></i>
									</div>
								</div>
								<div className="mfilter-content-opts">
									<div className="mfilter-opts-container">
										<div className="col-sm-12">
											<InputGroup>
												<Input style={{ width: '40%' }} maxLength="5" id="newCapacity" value={this.state.newCapacity || ""} onChange={this.onChange} />
												<InputGroupAddon addonType="append">
												<Button onClick={ () => this.handleCapacityChange(this.state.newCapacity)} style={{ marginTop: '6%' }}><i className="fas fa-redo"></i></Button>
												</InputGroupAddon>
											</InputGroup>				            
										</div>
									</div>

								</div>
							</li>
							<li className="mfilter-filter-item mfilter-checkbox mfilter-manufacturers">
								<div className="mfilter-heading">
									<div className="mfilter-heading-content">
										<div className="mfilter-heading-text">
											<span>{translate('services_w')}</span>
										</div>
											<i className="mfilter-head-icon"></i>
									</div>
								</div>
								<div className="mfilter-content-opts">
									<div className="mfilter-opts-container">
										<div className="mfilter-content-wrapper mfilter-iscroll scroll-content scroll-wrapper">
											<div className="mfilter-options">
												<div className="mfilter-options-container">
													<div className="mfilter-tb">
														{this.props.facilitiesList.map(facility => {
															var isSelected = this.props.facilitiesSelected.indexOf(facility.Code) != -1;
															return (
																<div key={facility.Code}>
																	<div className="mfilter-option mfilter-tb-as-tr mfilter-visible">
																		<div className='mfilter-tb-as-td mfilter-col-input mfilter-input-active'>
																			<input id={'mfilter-opts-attribs-32-manufacturers-' + facility.Code} name="facility" type="checkbox" checked={isSelected} onChange={() => this.handleCheckbox(facility.Code)} />
																		</div>
																		<label className="mfilter-tb-as-td">{facility.Description}</label>
																	</div>
																</div>
															);
														})}
													</div>
												</div>
											</div>
										</div>
										<div className="mfilter-clearfix"></div>
									</div>
									<div className="mfilter-clearfix"></div>
								</div>
							</li>
							<li className="mfilter-filter-item mfilter-tree mfilter-categories">
								<div className="mfilter-heading">
									<div className="mfilter-heading-content">
										<div className="mfilter-heading-text">
											<span>{translate('location_w')}</span>
										</div>
										<i className="mfilter-head-icon"></i>
									</div>
								</div>
								<div className="mfilter-content-opts">
									<div className="mfilter-opts-container">
										<div className="col-sm-12">
											<InputGroup>
												<Input id="newLocation" value={this.state.newLocation || ""} onChange={this.onChange} />
												<InputGroupAddon addonType="append">
												<Button onClick={ () => this.handleLocationChange(this.state.newLocation)} style={{ marginTop: '6%' }}><i className="fas fa-redo"></i></Button>
												</InputGroupAddon>
											</InputGroup>		            
										</div>
									</div>

								</div>
							</li>
						</ul>
					</div>
				</div>
           	</>
		);
	}
}

const enhance = compose(
    withRouter,
    withTranslate
)
export default enhance(Filters);