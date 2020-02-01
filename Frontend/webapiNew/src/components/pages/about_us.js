import React from 'react';
import Header from "../header/header";
import Footer from "../footer/footer";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class AboutUs extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        const { translate } = this.props;
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp! | {translate('about_us')}</title>
                    <meta name="description" content="-" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home" style={{ minHeight: "70vh" }}>
                    <div className="background-content"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="row">         
                                    <div className="col-md-12 center-column" id="content">   
                                        <h1>{translate('about_us')}</h1>              
                                        {translate('about_mainText')}
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

export default withTranslate(AboutUs);