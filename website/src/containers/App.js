import React,{Component} from "react";
import {connect} from "react-redux";
import {getAuthState} from '../useFirebase';
/** component */
import AfterSignIned from './AfterSignIned';
import BeforeSignIned from './BeforeSignIned.js';

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
        console.log('first time landing...checking user login state...');
        getAuthState(dispatch);
        return <div>check member login state..please wait...</div>
    }else{
        if(isLogin===true){
            console.log('state: sign in');
            return <AfterSignIned />;
        }else{
            console.log('state: sign out');
            return <BeforeSignIned />;
        }
    }
 
}

function mapStateToProps({auth,state},ownProps){
    return {
        auth,
        state,
    }
}
export default connect(mapStateToProps)(App);