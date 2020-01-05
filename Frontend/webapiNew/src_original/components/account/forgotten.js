import React from 'react';
import Header from "../header/header";
import Footer from "../footer/footer";
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import WidgetAccount from "../widgets/widgetAccount";

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class Forgotten extends React.Component {
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
                                        <li><Link to="/">{translate('my_account')}</Link></li>
                                        <li>{translate('forgotten')}</li>
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
                                                <h1>{translate('forgotten')}</h1>
                                                <p>{translate('forgotten_text_1')}</p>
                                                <form action="" method="post" className="form-horizontal">
                                                    <fieldset>
                                                        <legend>{translate('your_email_address')}</legend>
                                                        <div className="form-group row required">
                                                            <label className="col-md-2 control-label align-self-center" htmlFor="input-email">{translate('email_address')}</label>
                                                            <div className="col-md-10">
                                                                <input type="text" name="email" placeholder={translate('email_address')} id="input-email" className="form-control" />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                    <div className="buttons clearfix">
                                                        <div className="pull-left"><Link to={`${process.env.PUBLIC_URL}/account/login`} className="btn btn-default">{translate('back')}</Link></div>
                                                        <div className="pull-right">
                                                            <input type="submit" value={translate('continue')} className="btn btn-primary" />
                                                        </div>
                                                    </div>
                                                </form>
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

export default withTranslate(Forgotten);