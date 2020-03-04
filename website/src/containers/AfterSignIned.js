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
import Dashboard from '../components/dashboard/Dashboard.js';
import PurchaseHistory from '../components/purchase/PurchaseHistory';
import PurchaseCreating from '../components/purchase/PurchaseCreating';
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
        if(shop.status==='loading'){
            console.log('shop is loading');
            return <div>loading..</div>
        }
        return (
            <Router> 
                <Switch>
                    {/* <Route path="/test" render={()=><Purchase />} /> */}
                    <Route path="/auth" component={Auth}/> 
                    <Route path="/dashboard" render={()=><Dashboard shop={shop} shopRef={shopRef}/>}/>
                    <Route path="/purchase/new" render={(history)=><PurchaseCreating history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
                    <Route path="/purchase/history" render={(history)=><PurchaseHistory history={history} auth={auth} shop={shop} shopRef={shopRef} />}/>
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