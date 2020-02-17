import React,{Component, Fragment} from "react";
import {createHashHistory as history} from "history";
import {roundAfterPointAt} from "../../../lib";
/** component */
import SideNav from '../../layout/SideNav';
import OrderDetail from './OrderDetail';
import SupplierAddingForm from "../SupplierAddingForm";
/** other resource */
import editImg from "../../../img/editBtn.png";
import deleteImg from "../../../img/deleteBtn.png";

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
    render(){
        let onSupplierAdding=this.state.onSupplierAdding;
        let orderList=this.state.orderList;
        let orderid=this.props.match.params.orderid;
        return (
            <Fragment>
                <SideNav />
                {
                    orderid?
                    <OrderDetail shopUrl={this.props.shopUrl} shop={this.props.shop} id={orderid} />:
                    <div className="shopMainArea shopMainArea-purchase-orderHistory">
                        {/* 新增供應商 */}
                        {onSupplierAdding?<SupplierAddingForm shopRef={this.props.shop.shopRef} cancel={this.hideSupplierAddingForm} supplierExist={this.supplierExist} addingSuccess={this.addingSuccess} addingFail={this.addingFail}/>:null}
                        <div className="operatingArea">
                            <div className="currentInfo">
                                <div>採購管理 \ 歷史採購訂單</div>
                                <div>user: <span>{`Frank Lin`}</span></div>
                            </div>
                            <div className="operatingBtns">
                                <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/purchase/new`)}}>新增訂單</button>
                                <button className="btnForFormBig">庫存查詢</button>
                                <button className="btnForFormBig" onClick={this.showSupplierAddingForm}>新增供應商</button>
                            </div>
                        </div>
                        <div className="informationArea">
                            <div className="filterBlock">
                                
                            </div>
                            <div className="contentTable">
                                <div className="title tr">
                                    <span>訂單編號</span>
                                    <span>供應商</span>
                                    <span>成本總計</span>
                                    <span>件數總計</span>
                                    <span>平均利潤</span>
                                    <span>採購日期</span>
                                    <span>到貨進度</span>
                                    <span>操作</span>
                                </div>
                                {   
                                    orderList.length===0?
                                    null:
                                    orderList.map((order,index)=>{
                                    return (
                                        <div key={index} className="tr">
                                            <span>{order.id}</span>
                                            <span>{order.supplierTitle}</span>
                                            <span>{this.getOrderComputedResult(order).sumOfCost}</span>
                                            <span>{this.getOrderComputedResult(order).sumOfNum}</span>
                                            <span>{this.getOrderComputedResult(order).avgProfit}</span>
                                            <span>{this.getDateToYMD(order.time.seconds)}</span>
                                            <span className="showPercentage">{this.showPercentage(order)}</span>
                                            <span><img onClick={()=>{this.toDetailPage(order.id)}} src={editImg}/><img src={deleteImg}/></span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        )
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
        this.setState(preState=>({
            onSupplierAdding:false
        }))
    }
    addingSuccess=(title,address,phone)=>{
        alert(`供應商 ${title} 註冊成功，\n地址：${address}\n電話：${phone}`);
        this.setState(preState=>({
            onSupplierAdding:false
        }))
    }
    addingFail=(error)=>{
        console.error('ERROR\n 註冊供應商時發生錯誤');
        console.log(error)
    }
    getOrderComputedResult(order){
        let sumOfCost=0,sumOfNum=0,sumOfPrice=0,avgProfit=0;
        if(order){
            for(let product of order.products){
                for(let item of product.itemList){
                    sumOfCost+=item.num*product.cost;
                    sumOfNum+=parseInt(item.num);
                    sumOfPrice+=item.num*product.price;
                }
            }
            avgProfit=roundAfterPointAt((sumOfPrice-sumOfCost)/sumOfPrice,2);
            return {
                sumOfCost,
                sumOfNum,
                avgProfit,
            }
        }else{
            return {
                sumOfCost:"...",
                sumOfNum:"...",
                avgProfit:"...",
            }
        }
    }
    getDateToYMD(seconds){
        let date=new Date(seconds*1000);
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
    showPercentage(order){
        let number="10%";
        let style={
            width:number
        }
        return (
            <Fragment>
                <span className="color" style={style}>.</span>{number}
            </Fragment>
        )
    }
    toDetailPage=(orderid)=>{
        history().push(`${this.props.shopUrl}/purchase/history/${orderid}`);
    }
}

export default OrderHistory;