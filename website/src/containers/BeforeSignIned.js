import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Redirect
} from 'react-router-dom';
import MemberAuth from '../components/auth/MemberAuth';

function BeforeSignIned(){
    return (
        <Router> 
            <Route path="/auth/:type" component={MemberAuth}/>
             <Route exact path="/">
                <Redirect to="/auth/signin"/>
            </Route>
        </Router> 
    )
}

export default BeforeSignIned;