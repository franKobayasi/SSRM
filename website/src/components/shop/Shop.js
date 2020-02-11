import {createHashHistory as history} from 'history';
import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
import MemberAuth from '../auth/MemberAuth';
import Dashboard from '../dashboard/Dashboard.js';
import ShopAuth from './ShopAuth.js';
import ssrmFirebase,{fbAuthProvider,ssrmDB,getDataFromFireBase} from "../../useFirebase";


function Shop(props){
    console.log(props);
    let shopList=props.shopList;
    let currentShop={};
    currentShop.id=props.match.params.id;
    for(let shop of shopList){
        if(shop.id===currentShop.id){
            currentShop.title=shop.title;
            console.log(shop.title);
        }
    }
    return (
       <ShopSignOut currentShop={currentShop.title?currentShop:{title:'資料錯誤'}}/>
    )
}
function ShopSignOut(props){
    return <ShopAuth currentShop={props.currentShop}/>
}
function ShopSignIn(props){
    return (
        <Router> 
            <Switch>
                {/* <Route path="/shop/:id/order/checkout" render={Shop}/>  */}
                {/* <Route path="/shop/:id/order/history" render={Shop}/>  */}
                {/* <Route path="/shop/:id/purchase/keyin" render={Shop}/> */}
                {/* <Route path="/shop/:id/purchase/history" render={Shop}/> */}
                {/* <Route path="/shop/:id/stock/storage" render={Shop}/>  */}
                {/* <Route path="/shop/:id/stock/history" render={Shop}/>  */}
                {/* <Route path="/shop/:id/analysis" render={Shop}/>  */}
                {/* <Route path="/shop/:id/setting" render={Shop}/> */}
                {/* <Route path="/shop/:id/other" render={Shop}/> */}
                <Route path="/shop/:id">
                    {props.currentUser?<Redirect to={`${props.match.url}/order/checkout`}/>:<ShopAuth currentShop={currentShop}/>}
                </Route>
                <Route path="/auth/:id" component={MemberAuth}/> 
                <Route path="/dashboard/setting" render={()=><Dashboard />}/>
                <Route path="/dashboard" render={()=><Dashboard />}/>
                <Route exact path="/">
                    <Redirect to="/dashboard"/>
                </Route>
            </Switch>
        </Router> 
    )
}

function mapStateToProps({shopList},ownProps){
    return {
        shopList,
    };
}

export default connect(mapStateToProps)(Shop);