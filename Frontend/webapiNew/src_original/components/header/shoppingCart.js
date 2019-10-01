// react
import React from 'react';
import { connect } from "react-redux";
import { withTranslate } from 'react-redux-multilingual'
import { removeFromCart } from '../../services/cart/actions'
import { getCartTotalPrice, getCartTotalItems } from '../../services'
import { Link } from 'react-router-dom'
import $ from 'jquery';

class ShoppingCart extends React.Component {
    componentDidMount() {
		$(document).on('click', '#cart_block .dropdown-menu', function (e) {
			e.stopPropagation();
		});
    }
    render() {
    	const { translate, cartList, total_price, total_items, symbol, lang, removeFromCart } = this.props;
	    return (
			<div id="cart_block">
				<div className="cart-heading" >					
					<span id="cart-total"> {translate('search')}</span>
				</div>
			</div>
	    );
	}
}

function mapStateToProps(state) {
    return {
        lang: state.Intl,
        cartList: state.cartList.cart,
        total_price: getCartTotalPrice(state.cartList.cart),
        total_items: getCartTotalItems(state.cartList.cart),
        symbol: state.data.symbol,
    }
}

export default connect(mapStateToProps, {removeFromCart})(withTranslate(ShoppingCart));