import React,{Fragment,Component} from "react";
import {getDateToYMD}  from '../../lib';
import {Loading} from "./Loading";

/**
    Need Props:
    shopRef(use to access shop's database)
    callback(to control show or hide form)
 */

class FormCustomerEntry extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'',
            isNameRight:false,
            tel:'',
            isTelRight:false,
            address:'',
            remindMsg:'提示訊息',

        }
    }
    render(){
        let callback=this.props.callback;
        return (
            <div className="app-customer-entryForm fk-popBox">
                <div className="fk-popBox-title">新增顧客資料</div>
                <div className="fk-popBox-content">
                    <div className="fk-popBox-content-center fk-form">
                        <div className="fk-form-row">
                            <label>姓名</label>
                            <input placeholder="required" onChange={this.keyInName} type="text" value={this.state.name}/>
                        </div>
                        <div className="fk-form-row">
                            <label>電話</label>
                            <input placeholder="required" onChange={this.keyInTel} type="text" value={this.state.tel}/>
                        </div>
                        <div className="fk-form-row">
                            <label>地址</label>
                            <input placeholder="optional" onChange={this.keyInAdress} type="text" value={this.state.address}/>
                        </div>
                        <div className="fk-form-remindMsg">{this.state.remindMsg}</div>
                    </div>
                    <div className="fk-popBox-content-btns">
                        <button className="fx-btn--25LH-mainColor" onClick={this.submitCustomer}>送出</button>
                        <button className="fx-btn--25LH-mainColor" onClick={(evnt)=>{evnt.preventDefault(); callback(false)}}>取消</button>    
                    </div>
                </div>
            </div>
        )
    }
    keyInName=(evnt)=>{
        let value=evnt.target.value;        
        if(value.length===0){
            this.setState(preState=>({
                name:value,
                isNameRight:false,
                remindMsg:'尚未輸入',
            }))
        }else{
            this.setState(preState=>({
                name:value,
                isNameRight:true,
                remindMsg:'OK',
            }))
        }
    }
    keyInTel=(evnt)=>{
        let value=evnt.target.value;    
        if(value.length<5){
            this.setState(preState=>({
                tel:value,
                isTelRight:false,
                remindMsg:'電話號碼過短',
            }))
        }else if(/[A-z]|-/.test(value)){
            this.setState(preState=>({
                tel:value,
                isTelRight:false,
                remindMsg:'格式錯誤，不能有字母或是\'-\'符號',
            })) 
        }else{
            this.setState(preState=>({
                tel:value,
                isTelRight:true,
                remindMsg:'OK',
            }))
        }
    }
    keyInAdress=(evnt)=>{
        let value=evnt.target.value;
        if(value.length<5){
            this.setState(preState=>({
                address:value,
                remindMsg:'地址過短',
            }))
        }else{
            this.setState(preState=>({
                address:value,
                remindMsg:'OK',
            }))
        }
    }
    submitCustomer=(evnt)=>{
        evnt.preventDefault();
        let shopRef=this.props.shopRef;
        let isNameRight=this.state.isNameRight;
        let isTelRight=this.state.isTelRight;
        let name=this.state.name;
        let tel=this.state.tel;
        let address=this.state.address;
        if(!isNameRight){
            alert('尚未輸入姓名，請確認')
        }else if(!isTelRight){
            alert('尚未輸入電話或格式錯誤，請確認')
        }else{
            shopRef.collection('customers').doc(this.state.tel).get()
            .then(doc=>{
                if(doc.exists){
                    alert(`此電話已經註冊過\n顧客：${doc.data().name}!`)
                }else{
                    let customer={
                        name,
                        tel,
                        address:address?address:'未填寫',
                        tradeRecords:{}
                    }
                    shopRef.collection('customers').doc(this.state.tel).set(customer)
                    .then(res=>{
                        alert('新增成功！');
                        this.callback(false);
                    })
                    .catch(error=>{
                        alert('新增失敗！')
                        console.error('ERROR\n新增客戶失敗')
                        console.log(error);
                    })
                }
            })
        }
    } 
}

class Customer extends Component{
    constructor(props){
        super(props);
        this.state={
            isShow:false,
            getCustomerDetail:false,
        }
    }
    render(){
        let isShow=this.state.isShow;
        let customer=this.props.customer;
        let detail=this.state.detail;
        return (
            <Fragment>
                <button onClick={this.toShowDetail} className="fx-btn--25LH-mainColor">{customer[0]?customer[0]:'請查詢'}</button>
                {
                    isShow?
                    <div className="fk-popBox app-customer-detail">
                        <div className="fk-popBox-title">會員資料</div>
                    {
                        detail?
                        <div className="fk-popBox-content">
                            <div className="fk-popBox-content-center">
                            <div className="fk-form">
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">會員名稱</label><span>{detail.name}</span>
                                </div>
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">電話</label><span>{detail.tel}</span>
                                </div>
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">地址</label><span>{detail.address?detail.address:'未填寫'}</span>
                                </div>
                                <div className="fk-form-row">
                                    <label className="fk-form-cell-100px">累積消費</label><span>{this.getSumOfTrade(detail.tradeRecords)}</span>
                                </div>
                            </div>
                            <div className="fk-table--black">
                                <div className="fk-table-header">
                                    <span className="fk-table-cell-175px">結帳單號</span>
                                    <span className="fk-table-cell-75px">總件數</span>
                                    <span className="fk-table-cell-75px">消費金額</span>
                                    <span className="fk-table-cell-150px">交易日期</span>
                                </div>
                                {   
                                    !detail.tradeRecords||Object.keys(detail.tradeRecords).length===0?
                                    <div className="fk-table-highlighter">尚未有任何消費紀錄</div>:
                                    <div className="fk-table-scrollArea">
                                {
                                    Object.keys(detail.tradeRecords).map((key,index)=>{
                                        return (
                                            <div key={index} className="fk-table-row">
                                                <span className="fk-table-cell-175px">{key}</span>
                                                <span className="fk-table-cell-75px">{detail.tradeRecords[key].sumOfNum}</span>
                                                <span className="fk-table-cell-75px">{detail.tradeRecords[key].sumOfMoney}</span>
                                                <span className="fk-table-cell-150px">{getDateToYMD(detail.tradeRecords[key].time,true)}</span>
                                            </div>
                                        )
                                    })
                                }
                                    </div>
                                }
                            </div>
                            </div>
                            <div className="fk-popBox-content-btns">
                                <button className="fx-btn--25LH-mainColor" onClick={this.closeDetail}>關閉</button>
                            </div>
                        </div>:
                        <div className="fk-popBox-content"><Loading text="會員資料載入中" /></div>
                    }
                    </div>:null
                }
            </Fragment>
        )
    }
    componentDidUpdate(){
        let customer=this.props.customer
        if(this.state.isShow&&this.state.getCustomerDetail){
            this.props.shopRef.collection('customers').doc(customer[1]).get()
            .then(doc=>{
                this.setState(preState=>({
                    detail:doc.data(),
                    getCustomerDetail:false,
                }))
            })
        }
    }
    toShowDetail=()=>{
        if(this.props.customer[1]){
            this.setState(preState=>({
                isShow:true,
                getCustomerDetail:true,
            }))
        }else{
            alert('請先完成顧客查詢');
        }
    }
    closeDetail=()=>{
        this.setState(preState=>({
            isShow:false,
        }))
    }
    getSumOfTrade(tradeRecords){
        let sum=0;
        if(tradeRecords&&typeof tradeRecords==='object'){
            for(let orderid in tradeRecords){
                sum+=tradeRecords[orderid].sumOfMoney;
            }
        }
        return sum;
    }
}

export {FormCustomerEntry, Customer};