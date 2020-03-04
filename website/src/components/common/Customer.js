import React,{Fragment,Component} from "react";

/**
    Need Props:
    shopRef(use to access shop's database)
    callback(to control show or hide form)
 */

class CustomerForm extends Component{
    constructor(props){
        super(props);
        this.state={
            name:'',
            remindMsgName:'尚未輸入',
            isNameRight:false,
            tel:'',
            isTelRight:false,
            remindMsgTel:'尚未輸入',
            address:'',
            remindMsgAddress:'尚未輸入',

        }
    }
    render(){
        let callback=this.props.callback;
        return (
            <form className="customerEditForm">
                <label>姓名</label>
                <input onChange={this.keyInName} type="text" value={this.state.name}/>
                <div className="remindMsg">{this.state.remindMsgName}</div>
                <label>電話</label>
                <input onChange={this.keyInTel} type="text" value={this.state.tel}/>
                <div className="remindMsg">{this.state.remindMsgTel}</div>
                <label>地址</label>
                <input onChange={this.keyInAdress} type="text" value={this.state.address}/>
                <div className="remindMsg">{this.state.remindMsgAddress}</div>
                <button onClick={this.submitCustomer}>送出</button>
                <button onClick={(evnt)=>{evnt.preventDefault(); callback(false)}}>取消</button>
            </form>
        )
    }
    keyInName=(evnt)=>{
        let value=evnt.target.value;        
        if(value.length===0){
            this.setState(preState=>({
                name:value,
                isNameRight:false,
                remindMsgName:'尚未輸入',
            }))
        }else{
            this.setState(preState=>({
                name:value,
                isNameRight:true,
                remindMsgName:'OK',
            }))
        }
    }
    keyInTel=(evnt)=>{
        let value=evnt.target.value;    
        if(value.length===0){
            this.setState(preState=>({
                tel:value,
                isTelRight:false,
                remindMsgTel:'尚未輸入',
            }))
        }else if(/[A-z]|-/.test(value)){
            this.setState(preState=>({
                tel:value,
                isTelRight:false,
                remindMsgTel:'格式錯誤，不能有字母或是\'-\'符號',
            })) 
        }else{
            this.setState(preState=>({
                tel:value,
                isTelRight:true,
                remindMsgTel:'OK',
            }))
        }
    }
    keyInAdress=(evnt)=>{
        let value=evnt.target.value;
        if(value.length===0){
            this.setState(preState=>({
                address:value,
                remindMsgAddress:'尚未輸入',
            }))
        }else{
            this.setState(preState=>({
                address:value,
                remindMsgAddress:'OK',
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
                        tradeRecord:{
                            sum:0,
                            list:[],
                        }
                    }
                    shopRef.collection('customers').doc(this.state.tel).set(customer)
                    .then(res=>{
                        alert('新增成功！')
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

class CustomerDetail extends Component{
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
                <button onClick={this.toShowDetail} className="btnForFormBig customer">{customer[0]?customer[0]:'請查詢'}</button>
                {
                    isShow?
                    <div className="customerDetail ">
                        {
                            detail?
                            <Fragment>
                                <div className="btn" onClick={this.closeDetail}>關閉</div>
                                <div className="row"><span>{detail.name}</span></div>
                                <div className="table">                    
                                    <div className="row">
                                        <span>電話</span><span>{detail.tel}</span>
                                    </div>
                                    <div className="row">
                                        <span>地址</span>
                                        <span>{detail.address?detail.address:'未填寫'}</span>
                                    </div>
                                    <div className="row">
                                        <span>累積消費</span><span>{detail.tradeRecord.sum}</span>
                                    </div>
                                </div>
                                <div className="historyOfBuy tabel">
                                    <div className="row">
                                        <span>日期</span><span>總件數</span><span>消費金額</span>
                                    </div>
                                    {   
                                        detail.tradeRecord.list.length===0?
                                        <div className="note_No_item">尚未有任何消費紀錄</div>:
                                        detail.tradeRecord.list.map(buy=>{
                                            return (
                                                <div className="row">
                                                    <span>{buy.date}</span><span>{buy.num}</span><span>{buy.money}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Fragment>:
                            <div>查詢中..</div>
                        }
                    </div>:                        
                    null // <Alert title="錯誤提示" msg="請先完成查詢顧客" />
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
}

export {CustomerForm, CustomerDetail};