import React,{Fragment,Component} from "react";

class FormSubmitBooking extends Component{
    constructor(props){
        super(props);
        this.state={
            deposit:0,
            isDepositRight:false,
            remindMsg:'尚未輸入'
        }
    }
    render(){
        let deposit=this.state.deposit;
        let remindMsg=this.state.remindMsg;
        return (
            <div className="fk-popBox app-checkout-formSubmitBooking">
                <div className="fk-popBox-title">預付訂金</div>
                <form className="fk-popBox-content">
                    <div className="fk-popBox-content-center content">
                        <div className="deposit"><label>預付金額</label><input type="text" value={deposit} onChange={this.keyInDeposit}/></div>
                        <div className="remindMsg">{remindMsg}</div> 
                    </div>
                    <div className="fk-popBox-content-btns">
                        <button className="fx-btn--25LH-mainColor" onClick={this.submit}>完成</button>
                        <button className="fx-btn--25LH-mainColor" onClick={this.cancel}>取消</button>
                    </div>
                </form>
            </div>
        )
    }
    keyInDeposit=(evnt)=>{
        let value=evnt.target.value;
        if(value==0){
            this.setState(preState=>({
                remindMsg:'訂金不可為零',
                isDepositRight:false,
                deposit:value, 
            }))
        }else if(String(Number(value))==="NaN"){
            this.setState(preState=>({
                remindMsg:'輸入的值不正確',
                isDepositRight:false,
                deposit:value, 
            }))
        }else{
            this.setState(preState=>({
                remindMsg:'OK',
                isDepositRight:true,
                deposit:Number(value), 
            }))
        }
    }
    submit=()=>{
        let deposit=this.state.deposit;
        let isDepositRight=this.state.isDepositRight;
        if(!isDepositRight){
            alert(this.state.remindMsg);
        }else{
            this.props.setDeposit(deposit);
            this.props.toggle(false);
        }
    }
    cancel=()=>{
        this.props.toggle(false);
    }
}

export default FormSubmitBooking;