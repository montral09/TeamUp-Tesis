import React from 'react';
import Header from "../header/header";
import Footer from "../footer/footer";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import WidgetAccount from "../widgets/widgetAccount";

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Transaction extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }    
    render() {
        const { translate } = this.props;
        return (
            <>
                {/*SEO Support*/}
                <Helmet>
                    <title>Avano | My Account Page</title>
                    <meta name="description" content="Avano – Multipurpose eCommerce React Template" />
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
                                        <li><Link to="/">{translate('home')}</Link></li>
                                        <li>{translate('my_account')}</li>
                                        <li>{translate('your_transactions')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main-content  full-width  home">
                    <div className="background-content"></div>
                    <div className="background">
                        <div className="shadow"></div>
                        <div className="pattern">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">                                                                  
                                            <div className="col-md-9 center-column" id="content">
                                                <h1>{translate('your_transactions')}</h1>
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <td className="text-left">{translate('date_added')}</td>
                                                                <td className="text-left">{translate('description')}</td>
                                                                <td className="text-right">{translate('amount')}</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-center" colspan="5">{translate('transaction_empty')}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="buttons clearfix">
                                                    <div className="pull-right"><Link to={`${process.env.PUBLIC_URL}/account/account`} className="btn btn-primary">{translate('continue')}</Link></div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 " id="column-right">
                                                <WidgetAccount />
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

export default withTranslate(Transaction);