import React from 'react';
import Header from "../header/header";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { withTranslate } from 'react-redux-multilingual';
import { CONTACT_EMAIL } from '../../services/common/constants';

class PageNotFound extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        const { translate } = this.props;
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>TeamUp! | Error</title>
                    <meta name="description" content="" />
                </Helmet>
                {/*SEO Support End */}
                <Header />
                <div className="main-content  full-width  home">
                    <div className="background-content"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 center-column" id="content">
                                    
                                        <h1>{translate('error404_header')}</h1>
                                        <p>{translate('error404_detail') + CONTACT_EMAIL}</p> 
                                        <div className="buttons">
                                            <div className="pull-right"><Link to="/" className="btn btn-primary">Pagina Inicial</Link></div>
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

export default withTranslate(PageNotFound);