import React,{Component, Fragment} from "react";
import SupplierAddingForm from "../SupplierAddingForm";

class OrderHistory extends Component{
    constructor(props){
        super(props);
        this.state={
            onSupplierAdding:false,
            orderList:[]
        }
    }
    componentDidMount(){
        this.props.shop.shopRef.collection('purchases')
            .get()
            .then(snapshot=>{
                let orderList=[];
                snapshot.forEach(doc=>{
                    if(doc.exists){
                        let order=doc.data();
                        order.id=doc.id;
                        orderList.push(order);
                        this.setState(preState=>({
                            orderList,
                        }))
                    }else{
                        console.log('no any purchase history yet')
                    }
                })
            })
            .catch(error=>{
                console.error("ERROR\n伺服器發生錯誤，目前無法獲取歷史訂單資料，請稍後再試")
                console.log(error);
            })
    }
    componentDidUpdate(){
    }
    showSupplierAddingForm=()=>{
        this.setState(preState=>({
            onSupplierAdding:true,
        }))
    }
    hideSupplierAddingForm=()=>{
        this.setState(preState=>({
            onSupplierAdding:false,
        }))
    }
    supplierExist=(title,address,phone)=>{
        alert(`供應商 ${title} 已經存在，\n地址：${address}\n電話：${phone}`);
    }
    addingSuccess=(title,address,phone)=>{
        alert(`供應商 ${title} 註冊成功，\n地址：${address}\n電話：${phone}`);
    }
    addingFail=(error)=>{
        console.error('ERROR\n 註冊供應商時發生錯誤');
        console.log(error)
    }
    render(){
        let onSupplierAdding=this.state.onSupplierAdding;
        let orderList=this.state.orderList;
        return (
            <div className="shopMainArea-purchase-orderHistory">
                {/* 新增供應商 */}
                {onSupplierAdding?<SupplierAddingForm cancel={this.hideSupplierAddingForm} supplierExist={this.supplierExist} addingSuccess={this.addingSuccess} addingFail={this.addingFail}/>:null}
                <div className="operatingArea">
                    <div className="currentInfo">
                        <div>採購管理 \ 歷史採購訂單</div>
                        <div>user: <span>{`Frank Lin`}</span></div>
                    </div>
                    <div className="operatingBtns">
                        <button className="btnForFormBig">新增訂單</button> {/*返回訂單歷史*/}
                        <button className="btnForFormBig">庫存查詢</button>
                        <button className="btnForFormBig" onClick={this.showSupplierAddingForm}>新增供應商</button>
                    </div>
                </div>
                <div className="informationArea">
                    <div className="filterBlock">
                        
                    </div>
                    <div>
                        <span>訂單編號</span>
                        <span>供應商</span>
                        <span>成本總計</span>
                        <span>件數總計</span>
                        <span>平均利潤</span>
                    </div>
                    {   
                        orderList.length===0?
                        null:
                        orderList.map((order,index)=>{
                        return (
                            <div key={index} className="orderBox">{`訂單編號：${order.id}`}</div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default OrderHistory;