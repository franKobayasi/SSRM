import React,{Component,Fragment} from "react";
import { Redirect,useHistory } from "react-router-dom";
import {connect} from "react-redux";
import ssrmFirebase from "../../useFirebase";
import {actionSignOut} from "../../actions/actionCreator";
import {createHashHistory} from 'history';

function ShopSummary(props){
    return (
        <div className="shopBox">
            <div className="imgContainer">
                {props.mainImg?<img src={props.mainImg}/>:props.name[0]}
            </div>
            <div>{props.name}</div>
            <div>
                <span>刪除</span>
                <span>編輯</span>
            </div>
        </div>
    )
}

class Dashboard extends Component{
    constructor(props){
        super(props);
        this.signOut=this.signOut.bind(this);
    }
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    signOut(){
        ssrmFirebase.auth().signOut()
            .then((res)=>{
                console.log('logout!');
                this.props.dispatch(actionSignOut());
                let history=createHashHistory();
                history.push('/');
            })
            .catch((e)=>{
                console.log('ERROR',e);
            })

    }
    render(){
        let dashboard=this.props.dashboard

        return (
            <Fragment>
                <ul id="profile-sideMenu">
                    <li>{`Hi, ${dashboard.userName}!`}</li>
                    <li>關於 SSRM</li>
                    <li>特點介紹</li>
                    <li>意見反饋</li>
                    <li>設定</li>
                    <li onClick={this.signOut}>登出</li>
                </ul>
                <div id="profile-shopList">
                    {dashboard.shopList.map((shop,id)=>{
                        return <ShopSummary key={id} mainImg={shop.mainImg} name={shop.title} login={shop.login} edit={shop.edit}/>
                    })}
                    <div id="creatNewShop_btn">+</div>
                </div>
            </Fragment>
        )
    }
}


function mapStateToProps({auth,dashboard},ownProps){
    return {
        auth,
        dashboard,
    }
}

export default connect(mapStateToProps)(Dashboard);