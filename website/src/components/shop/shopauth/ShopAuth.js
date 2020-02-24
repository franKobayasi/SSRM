import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import {actionShopSignIn} from "../../../actions/shop";
import {ssrmDB} from "../../../useFirebase";
import {ajax} from "../../../lib";

class ShopAuth extends Component{ 
    constructor(props){
        super(props);
        this.state={
            isMaster:false,
        }
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState(preState=>{
            return {
                [id]:value
            }
        })
    }
    signInShop=(evnt)=>{
        let auth=this.props.auth;
        let shop=this.props.currentShop;
        let isMaster=this.state.isMaster;
        let name=isMaster?auth.MEMBER_NAME:this.state.name?this.state.name.trim():'';
        let password=this.state.password?this.state.password.trim():'';
        if(name.length===0){
            alert('請輸入用戶名稱');
        }else if(password.length===0){
            alert('請輸入密碼');
        }else{
            let reqBody={
                uid:auth.MEMBER_UID,
                shopID:shop.id,
                user:{
                    type:isMaster?'owner':'employee',
                    name:name,
                    password:password
                }
            }
            console.log(reqBody);
            let callback=(req)=>{
                let res=JSON.parse(req.response);
                console.log(res);
                if(res.state==="fail"){
                    alert(`登入失敗，${res.message}`);
                }else if(res.state==="success"){
                    this.props.dispatch(actionShopSignIn({
                        user:res.user,
                        id:shop.id,
                        title:shop.title,
                    }));
                    localStorage.setItem(`SSRM_${shop.id}_USERTOKEN`,JSON.stringify(res.user.id));
                    alert("登入成功");
                }else{
                    console.log(res);
                }
            }
            try{
                ajax('POST', "https://us-central1-ssrm-e7bc3.cloudfunctions.net/shopAuth", reqBody, {}, callback)
            }catch(error){
                console.log(error);
            }
        }
    }
    checkOutPanel=(evnt)=>{
        this.setState(preState=>{
            return {
                isMaster:!preState.isMaster,
            }
        })
    }
    render(){
        let shop=this.props.currentShop;
        console.log(this.props);
        return (
            <Fragment>
                <div id="shop-login-panel">
                <div className="shopLogo">{shop.title?shop.title[0]:'無'}</div>
                <span className="shopName">{shop.title}</span><br/>
                {this.state.isMaster?
                <span className="masterLabel" >Welcome! Master</span>:
                <input className="keyInBlock" onChange={this.handleChange} id="name" type="text" placeholder="輸入使用者名稱"/>
                }<br/>
                <input className="keyInBlock" onChange={this.handleChange} id="password" type="password" placeholder="輸入密碼"/><br/>
                {this.state.isMaster?
                <div onClick={this.checkOutPanel} className="btn checkOutPanel">店員<br/>登入</div>:
                <div onClick={this.checkOutPanel} className="btn checkOutPanel">店長<br/>登入</div>}
                <div onClick={this.signInShop} className="signIn_btn">登入</div>
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps({auth},ownProps){
    return {
        auth,
    }
}
export default connect(mapStateToProps)(ShopAuth);