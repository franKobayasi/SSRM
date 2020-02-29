import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Redirect
} from 'react-router-dom';
import Auth from '../components/auth/Auth';

function BeforeSignIned(){
    return (
        <Router> 
            <Route path="/auth" component={Auth}/>
            <Route exact path="/">
                <Redirect to="/auth"/>
            </Route>
        </Router> 
    )
}

export default BeforeSignIned;