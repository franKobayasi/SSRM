import React, {Fragment} from "react";
import SideNav from '../../layout/SideNav';
import CheckoutMain from './CheckoutMain';

function Checkout(props) {
    let history=props.history;
    let match=props.match;
    let shopUrl=props.shopUrl;
    let shop=props.shop;

    return (
        <Fragment>
            <SideNav />
            <CheckoutMain history={history} match={match} location={location} shopUrl={shopUrl} shop={shop}/>} />
        </Fragment>
    )
}

export default Checkout;
