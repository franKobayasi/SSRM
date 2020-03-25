import React,{Component} from "react";
import {connect} from "react-redux";
import {getAuthState} from '../useFirebase';
/** component */
import AfterSignIned from './AfterSignIned';
import BeforeSignIned from './BeforeSignIned.js';
import {LoadingBlack} from '../components/common/Loading';

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
        return <LoadingBlack text="S S R M  簡 單 店 家"/>
    }
    /** if system crush */
    if(isError===true){
        return <div id="errorMsg">網頁發生錯誤，系統修復中！我們將會在最短的時間內修復問題，造成不便，敬請見諒!</div>
    }
    /** check if store already have auth */
    if(isLogin==='unconnect'){
        /** firebase check login */
        getAuthState(dispatch);
        return <LoadingBlack text="Welcome to SSRM"/>
    }else{
        if(isLogin===true){
            return <AfterSignIned />;
        }else{
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