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
         let spaceTypes= ['Coworking', 'Oficinas', 'Sala de reuniones'];
         let services = [
             { id: 1,
                description : 'Wifi'
             },
             { id: 2,
                description : 'Cafetera'
             },
             { id: 3,
                description : 'Pizarron'
             }
            ];

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
														{spaceTypes > 0 ? (
															<li className="mfilter-to-parent">
																<a href="#category" onClick={() => alert('Llamar a API con nuevo filtro')}>
																	{spaceTypes.map(spaceType => {
                                                                        return (
																				<span>{spaceType.value}</span>
																		
                                                                    )})}
																</a>
															</li>
														) : (
															<>
																{spaceTypes.map(spaceType => {
																	return (
																		<li className="mfilter-tb-as-tr" >
																			<div className="mfilter-tb-as-td">
																				<a href="#category" onClick={() => alert('??')}>{spaceType}</a>
																			</div>
																		</li>
																	);
																})}
															</>
														)}
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
														{services.map(service => {
															return (
																<div key={service.id}>
																	
																		<div className="mfilter-option mfilter-tb-as-tr mfilter-visible">
																			<div className='mfilter-tb-as-td mfilter-col-input mfilter-input-active'>
																				<input id={'mfilter-opts-attribs-32-manufacturers-' + service.id} name="manufacturers" type="checkbox" readOnly={true} checked={true} />
																			</div>
																			<label className="mfilter-tb-as-td">{service.description}</label>
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