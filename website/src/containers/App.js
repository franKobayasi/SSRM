import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    useHistory,
    Redirect
} from 'react-router-dom';
import ssrmFirebase from '../useFirebase';
import {actionSignIn,actionSignOut} from "../actions/actionCreator";

/** pages */
import LoginPage from '../components/auth/LoginPage.js';
import Dashboard from '../components/dashboard/Dashboard.js';
import ShopPage from '../components/shop/ShopLogin.js';

function App(props){
    let isLogin=props.auth.isLogin;

    /** firebase check login */
    ssrmFirebase.auth().onAuthStateChanged(function(user){
        if(user){
            if(isLogin===true){
                
            }else{
                console.log('auto login!');
                props.dispatch(actionSignIn(user));
            }
        }else{
            if(isLogin===false){

            }else{
                console.log('not yet logined!');
                props.dispatch(actionSignOut())
            } 
        }
    });
    if(isLogin===undefined){
        return <div>loading</div>
    }
    return (
        <Router> 
            <Switch>
                <Route path="/auth/:id" component={LoginPage}/> {/*authorization*/}
                {/* render 的對象如果是 class 必須改為 function的方式，否則會失敗 */}
                <Route path="/shop/:id" render={ShopPage}/> {/* 必須使用 function component 才能將 route props下傳 */}
                <Route path="/dashboard" render={()=><Dashboard />}/>
                <Route exact path="/">
                    {props.auth.isLogin? <Redirect to="/dashboard"/>:<Redirect to="/auth/signin"/>}
                </Route>
            </Switch>
        </Router>
    )
}

function mapStateToProps({auth},ownProps){
    return {
        auth,
    }
}

export default connect(mapStateToProps)(App);