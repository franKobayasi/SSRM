import React,{Component,Fragment} from "react";
import { Redirect } from "react-router-dom";

function ShopSummary(props){
    return (
        <div class="shopBox">
            <div class="imgContainer">
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
    }
    componentDidMount(){

    }
    componentWillUnmount(){

    }
    render(){
        return (
            <Fragment>
                <ul id="profile-sideMenu">
                    <li>{`Hi, ${this.props.userName}!`}</li>
                    <li>關於 SSRM</li>
                    <li>特點介紹</li>
                    <li>意見反饋</li>
                    <li>設定</li>
                </ul>
                <div id="profile-shopList">
                    {this.props.shopList.map((shop)=>{
                        return <ShopSummary mainImg={shop.mainImg} name={shop.title} login={shop.login} edit={shop.edit}/>
                    })}
                    <div id="creatNewShop_btn">+</div>
                </div>
            </Fragment>
        )
    }
}

export default Dashboard;