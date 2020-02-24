import React,{Component} from "react";
import {connect} from "react-redux";
import ssrmFirebase,{ssrmDB} from "../../useFirebase";
import {actionSignIn} from "../../actions/auth";

class SignIn extends Component{
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
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
        ssrmFirebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
        .then((res)=>{
            let user=ssrmFirebase.auth().currentUser;
            console.log(user);
            if(user){
                let memberInfo={
                    name:user.displayName,
                    email:user.email,
                    uid:user.uid
                }
                this.props.dispatch(actionSignIn(memberInfo));
                console.log('sign in via email and password!');
                this.props.history.push('/');
            }else{
                console.log('some error is happen...');
            }
        })
        .catch((e)=>{
            var errorCode = e.code;
            var errorMessage = e.message;
            if(errorCode==='auth/invalid-email'){
                console.log('ERROR\nsignin fail: EMAIL格式錯誤');
            }else if(errorCode==='auth/wrong-password'){
                console.log('ERROR\nsignin fail: 密碼錯誤');
            }else if(errorCode==='auth/too-many-requests'){
                console.log('ERROR\nsignin fail: 錯誤次數過多，請稍後再試！');
            }else if(errorCode==='auth/user-not-found'){
                console.log('ERROR\nsignin fail: 無此帳號，請確認');
            }
        })
    }
    render(){
        return (
            <form className="member-signIn">
                <span>會員登入</span>
                <input id="email" type="text" name="user_id" placeholder="郵箱" onChange={this.handleChange} />
                <input id="password" type="password" name="password" placeholder="密碼" onChange={this.handleChange} />
                <input type="checkBox" name="remember_Me"/><label>記住我</label><br/>
                <button onClick={this.props.toRegister}>註冊</button>
                <button onClick={this.handleSubmit}>登入</button>
                <button onClick={this.props.loginViaFacebook}>以 FACEBOOK 帳號登入</button>
            </form>
        )
    }
}

function mapStateToProps({firebase},ownProps){
    return {
        firebase,
    }
}

export default connect(mapStateToProps)(SignIn);