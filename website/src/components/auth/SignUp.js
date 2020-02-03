import React,{Component} from "react";

export default class SignUp extends Component{
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
        console.log(this.state);
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