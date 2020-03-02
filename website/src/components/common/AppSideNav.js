import React,{Fragment, Component} from 'react';
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import ssrmFirebase from "../../useFirebase";
import {actionSignOut} from "../../actions/auth";
import {createHashHistory as history} from 'history';

class AppSideNav extends Component{
    constructor(props){
        super(props);
        this.state={
            isNavShow:false,
        }
    }
    toggleShowNav=()=>{
        this.setState(preState=>({
            isNavShow:!preState.isNavShow,
        }))
    }
    signOut=(evnt)=>{
        ssrmFirebase.auth().signOut()
        .then((res)=>{
            this.props.dispatch(actionSignOut());
            history().push('/');
        })
        .catch((error)=>{
            console.error('ERROR\nfirebase auth signout fail');
            console.log(error);
        })
    }
    render(){
        let isNavShow=this.state.isNavShow;
        return (
            <div id="app-sideNav" className={isNavShow?'':'app-sideNav-hide'}>
                <div onClick={this.toggleShowNav} id="app-sideNav-meunBtn">
                    <div></div><div></div><div></div>
                </div>
                <ul className="app-sideNav-main">
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/dashboard/`}>主控台</NavLink></li>
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/purchase/new`}>採購單登錄</NavLink></li>
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/purchase/history`}>採購單歷史查詢</NavLink></li>
                    <li><NavLink 
                        activeClassName="active"
                        to={`/stock/stockin`}>進貨登錄</NavLink></li>
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/stock/return`}>退貨登錄</NavLink></li>
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/stock/history`}>進退貨歷史查詢</NavLink></li>
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/checkout/history`}>歷史交易紀錄查詢</NavLink></li>
                    <li><NavLink 
                    activeClassName="active" 
                    to={`/analysis/`}>營運數據分析</NavLink></li>
                    <li><NavLink 
                        activeClassName="active" 
                        to={`/setting`}>店家設定</NavLink></li>
                </ul>
                <ul className="app-sideNav-footer">
                    <li id="app-sideNav-signOutBtn" onClick={this.signOut}>系統登出</li>
                    <li className="copyRight">Copyright &copy; 2019 <br/> SSRM All rights reserved</li>
                </ul>
            </div>
        )
    }
}

export default connect()(AppSideNav);