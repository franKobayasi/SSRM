import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
/** firebase */
import {ssrmDB} from '../../../useFirebase';
/** Component */
import PurchaseOrderHistory from '../purchase/OrderHistory';
import PurchaseOrderCreating from '../purchase/OrderCreating';

/**
    This Component should provide ShopRef and other common data which children component need.
    When come into this ShopSignIn component means that user had already sign into shop, the redux store should have shop user(name, id), title and id.
 */

class ShopSignIned extends Component{
    constructor(props){
        super(props);
        this.state={
            shopRef:ssrmDB.collection('members').doc(this.props.auth.MEMBER_UID).collection('shops').doc(this.props.shop.id),
        }
    }
    render(){
        let shopUrl=this.props.shopUrl;
        let shop=this.props.shop;
        shop.shopRef=this.state.shopRef;
        return (
        <Router> 
            <Switch>
                {/* <Route path="/shop/:shopid/order/checkout" component={Checkout}/>  */}
                {/* <Route path="/shop/:shopid/order/history" component={Checkout}/>  */}
                <Route path={`${shopUrl}/purchase/history/:orderid`} render={({history,match,location})=>
                <PurchaseOrderHistory history={history} match={match} location={location} shopUrl={shopUrl} shop={shop}/>}/>
                <Route path={`${shopUrl}/purchase/history/`} render={({history,match,location})=>
                <PurchaseOrderHistory history={history} match={match} location={location} shopUrl={shopUrl} shop={shop}/>}/>
                <Route path={`${shopUrl}/purchase/new/`} render={({history,match,location})=>
                <PurchaseOrderCreating history={history} match={match} location={location} shopUrl={shopUrl} shop={shop}/>}/>
                {/* <Route path="/shop/:shopid/stock/storage" component={Stock}/>  */}
                {/* <Route path="/shop/:shopid/stock/history" component={Stock}/>  */}
                {/* <Route path="/shop/:shopid/analysis" render={Analysis}/>  */}
                {/* <Route path="/shop/:shopid/setting/" render={SettingAndOther}/> */}
                {/* <Route path="/shop/:shopid/setting/other" render={SettingAndOther}/> */}
                <Route exact path="/shop/:shopid/">
                    <Redirect to={`${shopUrl}/purchase/new`}/>
                </Route>
            </Switch>
        </Router> 
        )
    }
}

function mapStateToProps({auth,shop}){
    return {
        auth,
        shop,
    }
}

export default connect(mapStateToProps)(ShopSignIned);