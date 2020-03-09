import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    Redirect,
    useParams,
    useLocation,
} from 'react-router-dom';
/** firebase */
import {ssrmDB} from "../useFirebase";
/** action creator */
import {actionShopSignIn} from "../actions/shop";
import {actionShopCreate} from "../actions/shop";
/** component */
import Auth from '../components/auth/Auth';
import {LoadingBlack} from '../components/common/Loading';
import Dashboard from '../components/dashboard/Dashboard.js';
import PurchaseHistory from '../components/purchase/PurchaseHistory';
import PurchaseCreating from '../components/purchase/PurchaseCreating';
import StockInOrder from "../components/stock/StockInOrder";
import StockReturnOrder from "../components/stock/StockReturnOrder";
import StockHistory from "../components/stock/StockHistory";
import Checkout from "../components/checkout/Checkout";
import Guide from '../components/common/Guide';

/** enter the app */
class AfterSignIned extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.initialShop();
    }
    render(){
        let shop=this.props.shop;
        let auth=this.props.auth;
        let shopRef=ssrmDB.collection('shops').doc(auth.MEMBER_UID);
        let onCheckoutMode=shop.onCheckoutMode;
        if(shop.status==='loading'){
            return <LoadingBlack text="店家資訊載入中"/>
        }
        return (
            shop.status==='create'?
            <Guide />:
            onCheckoutMode?
            <Router> 
                <Switch>
                    <Route path="/auth" component={Auth}/> 
                    <Route path="/checkout/new" render={(history)=><Checkout history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route exact path="/checkout/history" render={(history)=><Checkout history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/checkout/history/:orderid" render={(history)=><Checkout history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/">
                        <Redirect to="/checkout/new"/>
                    </Route>
                </Switch>
            </Router>:
            <Router> 
                <Switch>
                    {/* <Route path="/test" render={()=><Purchase />} /> */}
                    <Route path="/auth" component={Auth}/> 
                    <Route path="/dashboard" render={()=><Dashboard shop={shop} shopRef={shopRef}/>}/>
                    <Route path="/purchase/new" render={(history)=><PurchaseCreating history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route exact path="/purchase/history/" render={(history)=><PurchaseHistory history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/purchase/history/:orderid" render={(history)=><PurchaseHistory history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/stock/history" render={(history)=><StockHistory history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/stock/stockin" render={(history)=><StockInOrder history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/stock/return" render={(history)=><StockReturnOrder history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/">
                        <Redirect to="/dashboard"/>
                    </Route>
                </Switch>
            </Router>
        )
    }
    /** this func get shop info from firebase to redux store */
    initialShop=()=>{
        let uid=this.props.auth.MEMBER_UID;
        let dispatch=this.props.dispatch;
        ssrmDB.collection('shops').doc(uid).get()
        .then(doc=>{
            if(doc.exists){
                let shop=doc.data();
                dispatch(actionShopSignIn(shop));
            }else{
                dispatch(actionShopCreate());
            }
        })
    }
}

function mapStateToProps({auth,shop}){
    return {
        auth,
        shop,
    };
}
function mapDispatchToProps(dispatch){
    return {
        dispatch,
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AfterSignIned);