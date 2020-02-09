import React,{Component} from "react";
import {connect} from "react-redux";
import ssrmFirebase,{ssrmDB} from "../../useFirebase";
import {actionSignIn,actionSignOut,actionAuthError} from "../../actions/auth";
import {actionFetchPosted,actionFetchSuccessed,actionFetchFailed} from "../../actions/fetch";
import {createHashHistory as history} from 'history';

class SignUp extends Component{
    constructor(props){
        super(props);
        this.state={
            firstName:'',
            lastName:'',
            email:'',
            password:'',
            passwordCheck:'',
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChange(e){
        // e.persist();
        let id=e.target.id;
        let value=e.target.value;
        this.setState((preState)=>{
            return {
                [id]:value,
            }
        });
    }
    handleSubmit(e){
        e.preventDefault();
        let dispatch=this.props.dispatch;
        let firstName=this.state.firstName;
        let lastName=this.state.lastName;
        let email=this.state.email;
        let isEmailCorrect=/\w+@\w+\.\w+/.test(email);
        if(firstName.length===0){
            alert('請輸入姓氏');
        }else if(lastName.length===0){
            alert('請輸入名字');
        }else if(!isEmailCorrect){
            alert('email格式錯誤！')
        }else if(this.state.password<=5){
            alert('密碼長度不能少於5位')
        }else if(this.state.password===this.state.passwordCheck){
            let memberInfo={
                name:`${this.state.firstName} ${this.state.lastName}`,
            }
            let authInfo={
                email:this.state.email,
                password:this.state.password,
            }
            dispatch(actionFetchPosted());
            ssrmFirebase.auth().createUserWithEmailAndPassword(authInfo.email, authInfo.password)
                .then((res)=>{
                    console.log('firebase authentiaction sign up success！');
                    ssrmFirebase.auth().signInWithEmailAndPassword(authInfo.email, authInfo.password)
                        .then(()=>{
                            console.log('firebase auto signin success after sign up！');
                            let user = ssrmFirebase.auth().currentUser;
                            user.updateProfile({
                                displayName: memberInfo.name,
                            }).then(function() {
                                console.log('update user profile success！');
                                dispatch(actionFetchSuccessed());
                                history().push('/');
                            }).catch(function(error) {  
                                dispatch(actionFetchFailed()); 
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
                .catch((e)=>{
                    dispatch(actionFetchFailed());
                    console.error("ERROR\n sign up for new member fail");
                    console.log(e)
                })
        }else{
            alert('密碼不一致，請確認');
        }
    }
    render(){
        return (
            <form onSubmit={this.handleSubmit} className="member-signUp">
                <span>會員註冊</span>
                <input id="firstName" type="text" name="firstName" placeholder="姓氏" onChange={this.handleChange} />
                <input id="lastName" type="text" name="lastName" placeholder="名字" onChange={this.handleChange} />
                <input id="email" type="text" name="email" placeholder="郵箱" onChange={this.handleChange} />
                <input id="password" type="password" name="password" placeholder="密碼" onChange={this.handleChange} />
                <input id="passwordCheck" type="password" name="passwordCheck" placeholder="確認密碼" onChange={this.handleChange} />
                <button type="submit">確認註冊</button>
                <button onClick={this.props.loginViaFacebook}>以 FACEBOOK 帳號登入</button>
                <button onClick={this.props.toSignIn}>已經有帳號了？登入</button>
            </form>
        )
    }
}

function mapStateToProps({firebase},ownProps){
    return {
        firebase,
    }
}

export default connect(mapStateToProps)(SignUp);