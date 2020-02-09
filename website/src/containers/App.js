import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import {createHashHistory as history} from 'history';
import ssrmFirebase,{ssrmDB,getAuthState,getDataFromFireBase} from '../useFirebase';
/** action creator */
import {actionUpdateShopList} from "../actions/shopList";
/** pages */
import MemberAuth from '../components/auth/MemberAuth';
import Dashboard from '../components/dashboard/Dashboard.js';
import Shop from '../components/shop/ShopLogin.js';

function App(props){
    let isLogin=props.auth.isLogin;
    let isFetch=props.fetch.isFetch;
    let dispatch=props.dispatch;

    /** check if app is on fatch */
    if(isFetch===true){
        return <div>is fetching data...please wait...</div>
    }
    /** if firebase hangup */
    if(isLogin==='ERROR'){
        return <div>伺服器發生錯誤，人員搶修中，造成不便非常抱歉！我們將會在最短的時間內修復問題</div>
    }
    /** check if store already have auth */
    if(isLogin===undefined){
        /** firebase check login */
        console.log('first time landing');
        getAuthState(dispatch);
    }
    return (
        isLogin===true?<AfterSignIn />:<BeforeSignIn />
    )
}
function BeforeSignIn(){
    return (
        <Router> 
            <Route path="/auth/:id" component={MemberAuth}/>
             <Route exact path="/">
                <Redirect to="/auth/signin"/>
            </Route>
        </Router> 
    )
}
/** enter the app */
function AfterSignIn(){
    return (
        <Router> 
            <Switch>
                <Route path="/auth/:id" component={MemberAuth}/> 
                <Route path="/shop/:id/order/checkout" render={Shop}/> 
                <Route path="/shop/:id/order/history" render={Shop}/> 
                <Route path="/shop/:id/purchase/keyin" render={Shop}/>
                <Route path="/shop/:id/purchase/history" render={Shop}/>
                <Route path="/shop/:id/stock/storage" render={Shop}/> 
                <Route path="/shop/:id/stock/history" render={Shop}/> 
                <Route path="/shop/:id/analysis" render={Shop}/> 
                <Route path="/shop/:id/setting" render={Shop}/>
                <Route path="/shop/:id/other" render={Shop}/>
                <Route path="/dashboard/setting" render={()=><Dashboard />}/>
                <Route path="/dashboard" render={()=><Dashboard />}/>
                <Route exact path="/">
                    <Redirect to="/dashboard"/>
                </Route>
            </Switch>
        </Router>
    )
}
function mapStateToProps({auth,fetch},ownProps){
    return {
        auth,
        fetch,
    }
}
export default connect(mapStateToProps)(App);