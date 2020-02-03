import React,{Component} from "react";

export default class SignIn extends Component{
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
        console.log(this.state);
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
