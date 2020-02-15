import React,{ Component,Fragment } from "react";
import {ssrmDB} from "../../useFirebase";
/**
props={
    cancel: func,
    supplierExist: func.
    addingSuccess: func,
    addingFail: func
}

<SupplierAddingForm cancel={} supplierExist={} addingSuccess={} addingFail={}/>
*/

class SupplierAddingForm extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState((preState)=>{
            return {
                [id]:value,
            }
        });
    }
    /** 註冊新供應商 */
    submitNewSupplier=()=>{
        let title=this.state.tempSupplierName?this.state.tempSupplierName.trim():'';
        let address=this.state.tempSupplierAddress?this.state.tempSupplierAddress.trim():'';
        let phone=this.state.tempSupplierPhone?this.state.tempSupplierPhone.trim():'';
        if(title.length===0){
            alert('請輸入供應商名稱');
        }else if(address.length===0){
            alert('請輸入供應商地址');
        }else if(phone.length===0){
            alert('請輸入供應商電話');
        }else{
            (async()=>{
                let result= await this.checkSupplier(phone);
                console.log(result);
                if(result.supplier){
                    alert('供應商已存在，若供應商電話有重複或更改請至店家設定頁面更改');
                    this.props.supplierExist(title,address,phone);
                }else{
                    await ssrmDB.collection('members').doc(this.props.uid).collection('shops').doc(this.props.shop.id).collection('suppliers')
                        .doc(phone).set({
                            title,
                            address
                        })
                        .then((res)=>{
                            console.log(res);
                            alert('註冊成功！');
                            this.props.addingSuccess(title,address,phone);
                            return ;
                        })
                        .catch(error=>{
                            this.props.addingFail(error);
                        })
                }
            })();
        }
    }
    render(){
        return (
            <form className="supplierAddingForm">
                <div><label>供應商</label><input id="tempSupplierName" onChange={this.handleChange}/></div>
                <div><label>地址</label><input id="tempSupplierAddress" onChange={this.handleChange}/></div>
                <div><label>電話</label><input id="tempSupplierPhone" onChange={this.handleChange} placeholder={"電話將作為未來供應商查詢使用"}/></div>
                <div className="buttons">
                    <button className="finish" onClick={this.submitNewSupplier}>完成</button>
                    <button className="cancel" onClick={this.props.cancel}>取消</button>
                </div>
            </form>
        )
    }
}

export default SupplierAddingForm;