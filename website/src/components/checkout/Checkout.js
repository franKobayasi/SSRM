import React, {Fragment} from "react";
import AppHeaderBar from '../common/AppHeaderBar';
import AppSideNav from '../common/AppSideNav';
import CheckoutCreate from './CheckoutCreate'; 
import CheckoutHistory from './CheckoutHistory'; 
import CheckoutDetail from './CheckoutDetail';

function Checkout(props) {
    let history=props.history;
    let shop=props.shop;
    let shopRef=props.shopRef;
    let pathname=history.location.pathname;
    let orderid=history.match.params.orderid;
    console.log(pathname==='/checkout/new'||'/checkout/new/');
    
    return (
        <Fragment>
            <AppSideNav />
            <AppHeaderBar />
        {
            pathname==='/checkout/new'||pathname==='/checkout/new/'?
            <CheckoutCreate history={history} shop={shop} shopRef={shopRef} />:
            orderid?
            <CheckoutDetail history={history} shop={shop} shopRef={shopRef} />:
            <CheckoutHistory history={history} shop={shop} shopRef={shopRef} />
        }
        </Fragment>
    )
}

export default Checkout;
