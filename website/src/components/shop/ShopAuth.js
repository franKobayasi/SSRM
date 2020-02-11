import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import bgImg_memberLogin from "../../img/BgImage_member_login_page.jpg";

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
        let isMaster=this.state.isMaster
        let name=isMaster?this.props.auth.MEMBER_NAME:this.state.name?this.state.name.trim():'';
        let password=this.state.password?this.state.password.trim():'';
        if(name.length===0){
            alert('請輸入用戶名稱');
        }else if(password.length===0){
            alert('請輸入密碼');
        }else{
            const httpRequest = new XMLHttpRequest();
            httpRequest.open("POST","https://us-central1-ssrm-e7bc3.cloudfunctions.net/shopAuth",true);
            httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            console.log('sign in shop!');
            httpRequest.onreadystatechange = function(){
                try{
                    if (httpRequest.readyState===XMLHttpRequest.DONE) {
                        if(httpRequest.status===200){
                            console.log(httpRequest.response)
                            if(response.state==="success"){
                                /** 成功登入 */
                                alert('準備登入');
                            }
                        }else{
                            console.log("error");
                        }
                    }
                }catch(error){
                    alert(error);
                }
            };
            let reqBody={
                uid:this.props.auth.MEMBER_UID,
                shopID:this.props.currentShop.id,
                user:{
                    type:isMaster?'owner':'employee',
                    name:name,
                    password:password
                }
            }
            console.log(reqBody);
            httpRequest.send(JSON.stringify(reqBody));
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
        return (
            <Fragment>
                <div id="shop-login-panel">
                <div className="shopLogo">{shop.title[0]}</div>
                <span className="shopName">{shop.title}</span><br/>
                {this.state.isMaster?
                <span className="masterLabel" >Welcome! Master</span>:
                <input className="keyInBlock" onChange={this.handleChange} id="name" type="text" placeholder="輸入使用者名稱"/>
                }<br/>
                <input className="keyInBlock" onChange={this.handleChange} id="password" type="password" placeholder="輸入密碼"/><br/>
                {this.state.isMaster?
                <div onClick={this.checkOutPanel} className="checkOutPanel">店員<br/>登入</div>:
                <div onClick={this.checkOutPanel} className="checkOutPanel">店長<br/>登入</div>}
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

/**
https://us-central1-ssrm-e7bc3.cloudfunctions.net/shopAuth
 */