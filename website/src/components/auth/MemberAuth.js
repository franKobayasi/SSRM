import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import ssrmFirebase,{fbAuthProvider,ssrmDB,getDataFromFireBase} from "../../useFirebase";
import bgImg_memberLogin from "../../img/BgImage_member_login_page.jpg";
import SignIn from "./SignIn.js";
import SignUp from "./SignUp.js";
import {actionSignIn} from "../../actions/auth";

function MemberAuth(props){
    console.log(props);
    let id=props.match.params.id;
    let history=props.history;
    if(props.auth&&props.auth.isLogin){
        history.push('/');
    }
    let checkOutLayer=(e)=>{
        e.preventDefault();    
        if(id==='signup'){
            history.push('/auth/signin');
        }else{
            history.push('/auth/signup');
        }
    }

    const loginViaFacebook=(e)=>{
        e.preventDefault();
        ssrmFirebase.auth().signInWithPopup(fbAuthProvider)
            .then((result)=>{
                console.log('work');
                let user = result.user;
                let memberInfo={
                    email:user.email,
                    displayName:user.displayName,
                    uid:result.credential.accessToken,
                }
                props.dispatch(actionSignIn(memberInfo));
                props.history.push('/');
            })
            .catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                console.error(`ERROR\n firebase login via facebook account fail,\n
                user eamil: ${error.email}\n
                credentail: ${error.credential}`);
                console.log(error);
            });
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
                <SignUp toSignIn={checkOutLayer} loginViaFacebook={loginViaFacebook} history={props.history} />:
                <SignIn toRegister={checkOutLayer} loginViaFacebook={loginViaFacebook} history={props.history}/>}
            </div>
        </Fragment>
    )
}

function mapStateToProps({auth},ownProps){
    console.log(auth);
    return {
        auth,
    }
}

export default connect()(MemberAuth);