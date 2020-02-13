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
    const styleForShopSignIned = {
        position:"absolute",
    };
    return (
        <div id="sideMenu" style={props.currentShop?styleForShopSignIned:''} className={props.currentShop?"styleForShopSignIned":''}>
            <div id="website-logo"><img/>SSRM</div>
            <div className="member-name">{`Hi,  ${user.MEMBER_NAME}`}</div>
            <ul className="navBar">
                <li><NavLink exact to="/dashboard/">店家列表</NavLink></li>
                <li><NavLink to="/dashboard/setting">基本設定</NavLink></li>
                {/* <li>店家管理</li>
                <li className="navTitle">訂單管理</li>
                <li><NavLink to="/shop/:id/order/checkout">結帳台</NavLink></li>
                <li><NavLink to="/shop/:id/order/history">歷史訂單</NavLink></li>
                <li className="navTitle">採購管理</li>
                <li><NavLink to="/shop/:id/purchase/keyin">採購登入</NavLink></li>
                <li><NavLink to="/shop/:id/purchase/history">歷史訂單</NavLink></li>
                <li className="navTitle">庫存管理</li>
                <li><NavLink to="shop/:id/stock/storage">進貨作業</NavLink></li>
                <li><NavLink to="shop/:id/stock/history">歷史紀錄</NavLink></li>
                <li><NavLink to="shop/:id/analysis">數據分析</NavLink></li>
                <li className="navTitle">設定與其他</li>
                <li><NavLink to="/shop/:id/setting">設定</NavLink></li>
                <li><NavLink to="/shop/:id/other">其他</NavLink></li>  */}
            </ul>
            <ul className="navFooter">
                {/* <li><NavLink>關於 SSRM</NavLink></li> */}
                <li id="signOutBtn" className="btn" onClick={signOut}>登出 SSRM </li>
                <li>Copyright &copy; 2019 Frank Kobayasi<br/>All rights reserved</li>
            </ul>
        </div>
    )
}

export default connect()(SideNav);