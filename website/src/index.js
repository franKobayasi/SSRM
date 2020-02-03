import React,{Component} from "react";
import {render} from "react-dom";
import {Provider} from "react-redux";
import {createStore} from 'redux';

/** css file improt */
import './css/reset.css';
import './css/memberLogin.css';
import './css/shopLogin.css';
import './css/profile.css';

import ssrmReducers from './reducers/index.js';
import App from './containers/App';

const store=createStore(ssrmReducers,{
    isFetch:false,
    auth:initialLocalMemberInfo(),
},window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

function initialLocalMemberInfo(){
    let JSON_SSRM_MEMBER_INFO=localStorage.getItem('SSRM_MEMBER_INFO'), SSRM_MEMBER_INFO;
    if(JSON_SSRM_MEMBER_INFO){
        SSRM_MEMBER_INFO = JSON.parse(JSON_SSRM_MEMBER_INFO);
        if(typeof SSRM_MEMBER_INFO==='object'){
            return SSRM_MEMBER_INFO;
        }
    }
    return resetLocalMemberInfo();
}
function resetLocalMemberInfo(){
    let SSRM_MEMBER_INFO={
        member_uid:'',
        member_email:'',
        member_name:''
    }
    localStorage.setItem('SSRM_MEMBER_INFO',JSON.stringify(SSRM_MEMBER_INFO));
    return SSRM_MEMBER_INFO;
}

render(
    <Provider store={store}>
        <App />
    </Provider>
   ,document.querySelector("#root")
)
