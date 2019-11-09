import React from 'react';
import $ from 'jquery';

class Filters extends React.Component {
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
 	render() { 	
		return (
			<>
				<div className="box box-with-categories" id="mfilter-box-32">
					<h3 className="box-heading">Filtros</h3>
					<div className="box-content mfilter-content">
						<ul>
							<li className="mfilter-filter-item mfilter-tree mfilter-categories">
								<div className="mfilter-heading">
									<div className="mfilter-heading-content">
										<div className="mfilter-heading-text">
											<span>Tipos de espacio</span>
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
																		<a href="#category" onClick={() => alert('ID:'+spaceType.Code)}>{spaceType.Description}</a>
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
							<li className="mfilter-filter-item mfilter-checkbox mfilter-manufacturers">
								<div className="mfilter-heading">
									<div className="mfilter-heading-content">
										<div className="mfilter-heading-text">
											<span>Servicios</span>
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
															return (
																<div key={facility.Code}>
																	<div className="mfilter-option mfilter-tb-as-tr mfilter-visible">
																		<div className='mfilter-tb-as-td mfilter-col-input mfilter-input-active'>
																			<input id={'mfilter-opts-attribs-32-manufacturers-' + facility.Code} name="facility" type="checkbox" readOnly={true} checked={true} />
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
						</ul>
					</div>
				</div>
           	</>
		);
	}
}

export default Filters;