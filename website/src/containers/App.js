import React,{Component} from "react";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    useHistory,
    Redirect
} from 'react-router-dom';

/** firebase */
import {ssrmFirebase, DB} from '../getFirebase';

/** pages */
import LoginPage from '../components/auth/LoginPage.js';
import Dashboard from '../components/Dashboard.js';
import ShopPage from '../components/shop/ShopLogin.js';

function App(props){
    return (
        <Router> 
            <Switch>
                <Route path="/auth/:id" component={LoginPage}/> {/*authorization*/}
                {/* render 的對象如果是 class 必須改為 function的方式，否則會失敗 */}
                <Route path="/shop/:id" render={ShopPage}/> {/* 必須使用 function component 才能將 route props下傳 */}
                <Route path="/dashboard" render={()=><Dashboard />}/>
                <Route exact path="/">
                    {props.auth? <Redirect to="/dashboard"/>:<Redirect to="/auth/signin"/>}
                </Route>
            </Switch>
        </Router>
    )
}

export default App;

// <Profile userName="Frank" shopList={[{title:"REBORN 西門店"}]} />