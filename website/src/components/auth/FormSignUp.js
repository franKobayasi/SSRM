import React,{Component, Fragment} from "react";
import ssrmFirebase from "../../useFirebase";
import {actionSignIn} from "../../actions/auth";

class FormSignUp extends Component{
    constructor(props){
        super(props);
        this.state={
            username:'',
            email:'',
            password:'',
            password_check:'',
            remindMsg:'提示訊息',
            isUNRight:false,
            isEmailRight:false,
            isPWRight:false,
            isPWSame:false,
        }
    }
    render(){
        return (
            <Fragment>
            <form onSubmit={this.handleSubmit} className="app-auth-panel-inputArea fk-form--white">
                <div className="fk-form-row">
                    <span>會員名稱</span>
                    <input onChange={this.handleChange} id="username" type="text"/>
                </div>
                <div className="fk-form-row">
                    <span>Email</span>
                    <input onChange={this.handleChange} id="email" type="email"/>
                </div>
                <div className="fk-form-row">
                    <span>密碼</span>
                    <input onChange={this.handleChange} id="password" type="password"/>
                </div>
                <div className="fk-form-row">
                    <span>再次輸入</span>
                    <input onChange={this.handleChange} id="password_check" type="password"/>
                </div>
                <div className="fk-form-remindMsg">
                    <span>{this.state.remindMsg}</span>
                </div>
                <div className="fk-form-actionBtns">
                    <button className="fx-btn--white" type="submit">註冊</button>
                </div>
            </form>
            <div className="app-auth-panel-note">
                <span>已經有會員了？</span><button className="fx-btn--nobg" onClick={this.props.toggle}>登入</button>
            </div>    
            </Fragment>
        )
    }
    handleChange=(e)=>{
        let id=e.target.id;
        let value=e.target.value;
        let password=this.state.password;
        let msg='OK';
        if(id==='username'){
            if(value.length===0){
                msg='尚未輸入使用者名稱';
                this.setState(preState=>({                    
                    isUNRight:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isUNRight:true,
                }))
            }
        }
        if(id==='email'){
            if(!/\w+\@\w+\.\w+/.test(value)){
                msg='email格式不正確';
                this.setState(preState=>({                    
                    isEmailRight:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isEmailRight:true,
                }))
            }
        }
        if(id==="password"){
            if(value.length<5||!/[A-z]+\d+\w+/.test(value)){
                msg='密碼格式錯誤，請以字母開頭並至少包含兩個數字，總長度至少5個字以上';
                this.setState(preState=>({                    
                    isPWRight:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isPWRight:true,
                }))
            }
        }
        if(id==='password_check'){
            if(value!==password){
                msg='兩次密碼不一致';
                this.setState(preState=>({                    
                    isPWSame:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isPWSame:true,
                }))
            }
        }
        this.setState((preState)=>{
            return {
                [id]:value,
                remindMsg:msg,
            }
        });
    }
    handleSubmit=(e)=>{
        let isUNRight=this.state.isUNRight;
        let isEmailRight=this.state.isEmailRight;
        let isPWRight=this.state.isPWRight;
        let isPWSame=this.state.isPWSame;
        if(!isUNRight){
            alert('使用者名稱尚未輸入，請確認。');
        }else if(!isEmailRight){
            alert('email格式錯誤或未尚未輸入，請確認');
        }else if(!isPWRight){
            alert('密碼格式錯誤或未尚未輸入，請確認');
        }else if(!isPWSame){
            alert('兩次輸入的密碼不一致，請確認');
        }else{
            let signUpData=Object.assign({},this.state);
            delete signUpData.isCorrect;
            delete signUpData.remindMsg;
            delete signUpData.password_check;
            this.props.submitSignUp(signUpData);
        }
    }
}

export default FormSignUp;