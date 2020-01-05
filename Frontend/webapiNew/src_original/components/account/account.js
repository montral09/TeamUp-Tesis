import React from 'react';
import Header from "../header/header";
import Footer from "../footer/footer";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import WidgetAccount from "../widgets/widgetAccount";

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Account extends React.Component {
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
                                                <h4>{translate('my_account')}</h4>
                                                <ul className="list-unstyled">
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/edit`}>{translate('edit_your_account_information')}</Link></li>
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/password`}>{translate('change_your_password')}</Link></li>
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/address`}>{translate('modify_your_address_book_entries')}</Link></li>
                                                    <li><Link to={`${process.env.PUBLIC_URL}/wishlist`}>{translate('modify_your_wishlist')}</Link></li>
                                                </ul>
                                                <h4>{translate('my_orders')}</h4>
                                                <ul className="list-unstyled">
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/order`}>{translate('view_your_order_history')}</Link></li>
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/downloads`}>{translate('downloads')}</Link></li>
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/return`}>{translate('view_your_return_requests')}</Link></li>
                                                    <li><Link to={`${process.env.PUBLIC_URL}/account/transaction`}>{translate('your_transactions')}</Link></li>
                                                </ul>
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

export default withTranslate(Account);