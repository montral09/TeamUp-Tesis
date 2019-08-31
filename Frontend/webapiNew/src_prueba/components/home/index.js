import React from 'react';
import Header from "../header/header";

import { Helmet } from 'react-helmet'

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Index extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        const {translate} = this.props;
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>Avano | Home Page</title>
                    <meta name="description" content="Avano – Multipurpose eCommerce React Template" />
                </Helmet>
                {/*SEO Support End */}
                <Header  />
                <div className="main-content  full-width  home">
                    <div className="background-content"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                
                                <div className="row">
                                    <div className="col-md-3" id="column_left">
                                        
                                    </div>
                                    <div className="col-md-9">
                                        
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

export default withTranslate(Index);