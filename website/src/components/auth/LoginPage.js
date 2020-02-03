import React,{Component,Fragment} from "react";
import bgImg_memberLogin from "../../img/BgImage_member_login_page.jpg";
import SignIn from "./SignIn.js";
import SignUp from "./SignUp.js";
// import {useHistory} from 'react-router-dom';

function LoginPage(props){
    console.log(props);
    let id=props.match.params.id;

    let checkOutLayer=(e)=>{
        e.preventDefault();
        let history=props.history;
        let id=props.match.params.id;
        if(id==='signup'){
            history.push('/auth/signin');
        }else{
            history.push('/auth/signup');
        }
    }

    return (
        <Fragment>
            <div id="bannerPanel">
                <img src={bgImg_memberLogin} />
                <div id="messageBanner">
                    <span>簡單店家</span>
                    <p>簡單操作，解決您在開店過程中<br/>
                    結帳、進貨、庫存查詢及營業數<br/>
                    據處理等問題。</p>
                    <p>點擊註冊，讓我們協助您專注在<br/>
                    衣服的品質與款式風格，打雜交<br/>
                    給簡單店家。</p>
                </div>
            </div>
            <div id="inputPanel">
                {id==="signup"?
                <SignUp signUp={(e)=>{console.log(e)}}
                        loginViaFacebook={(e)=>{console.log(e)}}
                        toSignIn={checkOutLayer}
                />:
                <SignIn toRegister={checkOutLayer}
                        loginViaEmailAndPassword={(e)=>{console.log(e)}}
                        loginViaFacebook={(e)=>{console.log(e)}}
                />}
            </div>
        </Fragment>
    )
}

export default LoginPage;