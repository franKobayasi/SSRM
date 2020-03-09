import React,{ Fragment,Component } from "react";

/**
Need Props:
submit(func with parameter: user and reason);
cancel(func canel submit)
title(string)

 */

class ModifySubmit extends Component{
    constructor(props){
        super(props);
        this.state={
            operator:'',
            reason:'',
            remindMsg:'提示訊息',
        }
    }
    render(){
        let title=this.props.title;
        let operator=this.state.operator;
        let reason=this.state.reason;
        let remindMsg=this.state.remindMsg;
        return (
            <form className="fk-popBox app-orderModifySubmit">
                <div className="fk-popBox-title">{title}</div>
                <div className="fk-popBox-content">
                    <div className="fk-form">
                        <div className="fk-form-row">
                            <label>操作人員</label>
                            <input onChange={this.handleChange} id="operator" defaultValue='required' value={operator}/>
                        </div>
                        <div className="fk-form-row">
                            <label>修改原因</label>
                            <textarea id="reason" value={reason} onChange={this.handleChange} />
                        </div>
                        <div className="fk-form-remindMsg">{this.state.remindMsg}</div>
                    </div>
                    <div className="fk-popBox-content-btns"> 
                        <button className="fx-btn--25LH-mainColor" onClick={this.submitOrder}>送出</button>
                        <button className="fx-btn--25LH-mainColor" onClick={this.cancelSubmit}>取消</button>
                    </div>
                </div>
            </form>
        )
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value.trim();
        let msg='OK';
        if(id==='operator'&&value.length<1){
            msg='操作人員名稱長度過短，至少一個字';
        }
        if(id==='modifyDescription'&&value.length<5){
            msg='修改原因說明長度過短，至少5個字';
        }
        this.setState((preState)=>{
            return {
                [id]:value,
                remindMsg:msg,
            }
        });
    }
    submitOrder=()=>{
        let operator=this.state.operator;
        let reason=this.state.reason;
        this.props.submit(operator,reason);
    }
    cancelSubmit=()=>{
        this.props.cancel();
    }
}

export default ModifySubmit;