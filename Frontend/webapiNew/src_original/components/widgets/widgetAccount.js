import React from 'react';
import { Link } from 'react-router-dom';

// Multilanguage
import { withTranslate } from 'react-redux-multilingual'

class WidgetAccount extends React.Component {
 	render() {
 		const { translate } = this.props;
		return (
            <div className="box">
                <div className="box-heading">{translate('account')}</div>
                <div className="strip-line"></div>
                <div className="box-content">
                    <ul className="list-box">
                        <li><Link to={`${process.env.PUBLIC_URL}/account/login`}>{translate('login')}</Link> / <Link to={`${process.env.PUBLIC_URL}/account/register`}>{translate('register')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/forgotten`}>{translate('forgotten')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/account`}>{translate('my_account')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/address`}>{translate('address_book')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/wishlist`}>{translate('wishlist')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/order`}>{translate('order_history')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/downloads`}>{translate('downloads')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/return`}>{translate('returns')}</Link></li>
                        <li><Link to={`${process.env.PUBLIC_URL}/account/transaction`}>{translate('transactions')}</Link></li>
                    </ul>
                </div>
            </div>
		);
	}
}

export default withTranslate(WidgetAccount)