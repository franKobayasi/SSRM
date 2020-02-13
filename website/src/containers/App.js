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
/** pages */
import MemberAuth from '../components/auth/MemberAuth';
import Dashboard from '../components/dashboard/Dashboard.js';
import Shop from '../components/shop/Shop.js';
import Stock from '../components/shop/Stock';
import Purchase from '../components/shop/purchase/Purchase';

/*
    載入App需依序確認幾件事情：
    1. member登入狀態
        - SignIned
        - SignOuted
    2. shop登入狀態
        - 需要 currentShop && currentUser

    每次 dispatch就會觸發程式從頭來過，避免不必要的dispatch
*/

function App(props){
    let isLogin=props.auth.isLogin;
    let isFetch=props.state.isFetch;
    let isError=props.state.isError;
    let dispatch=props.dispatch;
    let shopList=props.shopList;
    let currentShop;

    /** this func aysc shopList from firebase to redux store */
    const asyncShopListFromFirebase=()=>{
        if(shopList==="undefined"){
            dispatch(actionFetchPosted());
            ssrmDB.collection('members').doc(props.auth.MEMBER_UID).collection('shops').get()
            .then(snapshot=>{
                let shopList=[];
                snapshot.forEach(doc=>{
                    let shop={
                        id:doc.id,
                        title:doc.data().title
                    };
                    shopList.push(shop);
                })
                dispatch(actionUpdateShopList(shopList));
                dispatch(actionFetchSuccessed());
            })
        }
    }
    /** check if app is on fatch */
    if(isFetch===true){
        return <div>is fetching data...please wait...</div>
    }
    /** if system crush */
    if(isError===true){
        return <div id="errorMsg">網頁發生錯誤，系統修復中！我們將會在最短的時間內修復問題，造成不便，敬請見諒!</div>
    }
    /** check if store already have auth */
    if(isLogin===undefined){
        /** firebase check login */
        console.log('first time landing');
        getAuthState(dispatch);
        return <div>is fetching data...please wait...</div>
    }else{
        if(isLogin===true){
            console.log('登入了');
            asyncShopListFromFirebase();
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
                <Route path="/test" render={()=><Purchase />} />
                <Route path="/auth/:id" component={MemberAuth}/> 
                <Route path="/shop/:id" component={Shop}/>
                <Route path="/dashboard/setting" render={()=><Dashboard />}/>
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