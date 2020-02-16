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
import {createHashHistory as history} from 'history';
import ssrmFirebase,{ssrmDB,getAuthState,getDataFromFireBase} from '../useFirebase';
/** action creator */
import {actionUpdateShopList} from "../actions/shopList";
import {actionFetchPosted,actionFetchSuccessed} from "../actions/fetch";
/** component */
import MemberAuth from '../components/auth/MemberAuth';
import Dashboard from '../components/dashboard/Dashboard.js';
import Shop from '../components/shop/Shop.js';
import Stock from '../components/shop/Stock';

/*
    This Component 
    - have to check user's auth state to give different Routes Sets:  SignIn/SignOut
    - According to App state to render different views.:  isFetch/isError/....
    
*/

function App(props){
    let isLogin=props.auth.isLogin;
    let isFetch=props.state.isFetch;
    let isError=props.state.isError;
    let dispatch=props.dispatch;
    let shopList=props.shopList;
    let currentShop;

    /** check if app is on fatch */
    if(isFetch===true){
        return <div>is fetching data...please wait...</div>
    }
    /** if system crush */
    if(isError===true){
        return <div id="errorMsg">網頁發生錯誤，系統修復中！我們將會在最短的時間內修復問題，造成不便，敬請見諒!</div>
    }
    /** check if store already have auth */
    if(isLogin==='unconnect'){
        /** firebase check login */
        console.log('first time landing');
        getAuthState(dispatch);
        return <div>check member login state..please wait...</div>
    }else{
        if(isLogin===true){
            console.log('登入了');
            return <AfterSignIn />;
        }else{
            console.log('還沒登入');
            return <BeforeSignIn />;
        }
    }
 
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
                {/* <Route path="/test" render={()=><Purchase />} /> */}
                <Route path="/auth/:type" component={MemberAuth}/> 
                <Route path="/shop/:shopid" component={Shop}/>
                <Route exact path="/dashboard/setting" render={()=><Dashboard />}/>
                <Route path="/dashboard" render={()=><Dashboard />}/>
                <Route path="/">
                    <Redirect to="/dashboard"/>
                </Route>
            </Switch>
        </Router>
    )
}
function mapStateToProps({auth,state,shopList},ownProps){
    return {
        auth,
        state,
        shopList,
    }
}
export default connect(mapStateToProps)(App);