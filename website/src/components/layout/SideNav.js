import React,{Fragment} from 'react';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import ssrmFirebase,{ssrmDB} from "../../useFirebase";
import {actionSignOut} from "../../actions/auth";
import {createHashHistory as history} from 'history';

function SideNav(props){
    console.log(props);
    let user=props.auth;
    const signOut=(evnt)=>{
        ssrmFirebase.auth().signOut()
            .then((res)=>{
                console.log('logout!');
                props.dispatch(actionSignOut());
                history().push('/');
            })
            .catch((err)=>{
                console.error('ERROR\nfirebase auth signout fail');
                console.log(err)
            })
    }
    return (
        <div id="sideMenu">
            <div id="website-logo"><img/>SSRM</div>
            <div className="member-name">{`Hi,  ${user.MEMBER_NAME}`}</div>
            <ul className="navBar">
                <li><NavLink exact to="/dashboard/">店家列表</NavLink></li>
                <li><NavLink to="/dashboard/setting">基本設定</NavLink></li>
            </ul>
            <ul className="navFooter">
                {/* <li><NavLink>關於 SSRM</NavLink></li> */}
                <li id="signOutBtn" className="btn" onClick={signOut}>登出 SSRM </li>
                <li>Copyright &copy; 2019 Frank Kobayasi<br/>All rights reserved</li>
            </ul>
        </div>
    )
}

function mapStateToProps({auth,shop}){
    return {
        auth,
        shop
    }
}

export default connect(mapStateToProps)(SideNav);