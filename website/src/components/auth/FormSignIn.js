import React,{Component,Fragment} from "react";
import {connect} from "react-redux";

import ssrmFirebase,{fbAuthProvider,ssrmDB,getDataFromFireBase} from "../../useFirebase";

import {actionSignIn} from "../../actions/auth";

class FormSignIn extends Component{
    constructor(props){
        super(props);
        this.state={
            email:'',
            isEmailRight:false,
            password:'',
            isPWRight:false,
            remindMsg:'提示訊息',
        }
    }
    render(){
        return (
            <Fragment>
                <form onSubmit={this.handleSubmit} className="app-auth-panel-inputArea fk-form--white">
                    <div className="fk-form-row">
                        <span>Email</span>
                        <input onChange={this.handleChange} id="email" type="email" value={this.state.email}/>
                    </div>
                    <div className="fk-form-row">
                        <span>密碼</span>
                        <input onChange={this.handleChange} id="password" type="password" value={this.state.password}/>
                    </div>
                    <div className="fk-form-remindMsg">
                        {this.state.remindMsg}
                    </div>
                    <div className="fk-form-actionBtns">
                        <span className="fx-btn--white" onClick={this.props.facebook}>FACDBOOK登入</span>
                        <button className="fx-btn--white" type="submit">登入</button>
                    </div>
                </form>
                <div className="app-auth-panel-note">
                    <span>還不是會員？</span><button className="fx-btn--nobg" onClick={this.props.toggle}>註冊會員</button>
                </div>
            </Fragment>
        )
    }
    handleChange=(e)=>{
        let id=e.target.id;
        let value=e.target.value;
        let msg='OK';
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
        if(id==='password'){
            if(value.length<5||!/[A-z]+\d+\w+/.test(value)){
                msg='密碼格式不正確';
                this.setState(preState=>({                    
                    isPWRight:false,
                }))
            }else{
                this.setState(preState=>({                    
                    isPWRight:true,
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
        e.preventDefault();
        let email=this.state.email;
        let password=this.state.password;
        let isEmailRight=this.state.isEmailRight;
        let isPWRight=this.state.isPWRight;
        if(!isEmailRight){
            alert('Email未填寫或格式錯誤，請確認。');
        }else if(!isPWRight){
            alert('密碼未填寫或格式錯誤，請確認。');
        }else{
           this.props.default(email,password);
        }
    }
}

export default FormSignIn;