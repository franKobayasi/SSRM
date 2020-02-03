import React,{Component} from "react";
import {connect} from "react-redux";
import ssrmFirebase,{ssrmDB} from "../../useFirebase";
import {createHashHistory} from 'history';

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
        if(this.state.password===this.state.passwordCheck){
            let memberInfo={
                username:`${this.state.firstName} ${this.state.lastName}`,
                email:this.state.email,
            }
            let authInfo={
                email:this.state.email,
                password:this.state.password,
            }
            ssrmFirebase.auth().createUserWithEmailAndPassword(authInfo.email, authInfo.password)
                .then((res)=>{
                    console.log('firebase authentiaction sign up success！')
                    ssrmDB.collection('member').doc(res.user.uid).set({
                        email:authInfo.email,
                        userName:memberInfo.username
                    })
                    .then((res)=>{
                        console.log('member data update to firebase success!');
                        alert("註冊成功");
                        createHashHistory().push('/auth/signin');

                    })
                })
                .catch((e)=>{
                    console.log("ERROR",e);
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
                <button type="submit">註冊並登入</button>
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