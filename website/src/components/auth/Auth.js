import React,{Component,Fragment} from "react";
import {connect} from "react-redux";
import ssrmFirebase,{fbAuthProvider} from "../../useFirebase";
import FormSignIn from './FormSignIn';
import FormSignUp from './FormSignUp';
import {actionSignIn} from "../../actions/auth";
import {actionFetchStart, actionFetchFinish} from "../../actions/fetch";
import webLogo from '../../img/SSRM_logo.png';

class Auth extends Component{
    constructor(props){
        super(props);
        this.state={
            showSignUp:false
        }
    }
    render(){
        let showSignUp=this.state.showSignUp;
        return (
            <div className="app-auth">
                <div className="app-auth-panel">
                    <div className="app-auth-panel-signBoard">
                        <img className="webLogo" src={webLogo}/>
                        <span className="webDescription">
                            <span className="title">“ 專為微型服飾店家而生的輕型店家資源管理系統 ”</span>
                            <span className="content">
                                操作簡單，提供小型服飾商戶在處理採購、供應商進退貨、結帳等環節上的解決方案，讓您能專注在服飾的品質與客戶服務，資訊統整交給簡單店家！
                            </span>
                        </span>
                    </div>
                    {
                        showSignUp?
                        <FormSignUp toggle={this.toggle} submitSignUp={this.submitSignUp}/>:
                        <FormSignIn toggle={this.toggle} default={this.signInViaEmailAndPassword} facebook={this.signInViaFacebook}/>
                    }
                </div>
            </div>
        )
    }
    toggle=()=>{
        this.setState(preState=>({
            showSignUp:!preState.showSignUp
        }))
    }
    signInViaEmailAndPassword=(email,password)=>{
        ssrmFirebase.auth().signInWithEmailAndPassword(email,password)
        .then((res)=>{
            let user=ssrmFirebase.auth().currentUser;
            if(user){
                let memberInfo={
                    name:user.displayName,
                    email:user.email,
                    uid:user.uid
                }
                this.props.dispatch(actionSignIn(memberInfo));
                this.props.history.push('/');
            }
        })
        .catch((e)=>{
            var errorCode = e.code;
            var errorMessage = e.message;
            if(errorCode==='auth/invalid-email'){
                alert('ERROR\nsignin fail: EMAIL格式錯誤');
            }else if(errorCode==='auth/wrong-password'){
                alert('ERROR\nsignin fail: 密碼錯誤');
            }else if(errorCode==='auth/too-many-requests'){
                alert('ERROR\nsignin fail: 錯誤次數過多，請稍後再試！');
            }else if(errorCode==='auth/user-not-found'){
                alert('ERROR\nsignin fail: 無此帳號，請確認');
            }
        })
    }
    signInViaFacebook=()=>{
        ssrmFirebase.auth().signInWithPopup(fbAuthProvider)
        .then((result)=>{
            let user = result.user;
            let memberInfo={
                email:user.email,
                displayName:user.displayName,
                uid:user.uid
            }
            this.props.dispatch(actionSignIn(memberInfo));
            this.props.history.push('/');
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
    submitSignUp=(data)=>{
        let dispatch=this.props.dispatch;
        dispatch(actionFetchStart());
        ssrmFirebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then((res)=>{
            ssrmFirebase.auth().signInWithEmailAndPassword(data.email, data.password)
            .then(()=>{
                let user = ssrmFirebase.auth().currentUser;
                user.updateProfile({
                    displayName: data.username,
                }).then(function() {
                    dispatch(actionFetchFinish());
                    let user = ssrmFirebase.auth().currentUser;
                    let memberInfo={
                        name:user.displayName,
                        email:user.email,
                        uid:user.uid
                    }
                    dispatch(actionSignIn(memberInfo));
                    history().push('/');
                }).catch(function(error) {  
                    dispatch(actionFetchFinish()); 
                    console.error('ERROR\nupdate user profile fail！');
                    console.log(error);
                });
            })
            .catch(function(error) {
                dispatch(actionFetchFailed()); 
                let errorCode = error.code
                let errorMessage = error.message;
                console.error('ERROR\nauto signin fail after sign up！');
                console.log(`error type:${errorCode}\nerror msg:${errorMessage}`);
            });
        })
        /** 如果 firebase 伺服器發生問題 */
        .catch((error)=>{
            dispatch(actionFetchFailed());
            console.error("ERROR\n sign up for new member fail");
            console.log(error)
        })
    }
}

export default connect()(Auth);