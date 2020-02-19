import React,{Component, Fragment} from 'react';
import {createHashHistory as history} from 'history';
import {roundAfterPointAt} from '../../../lib';
/** component */
import SideNav from '../../layout/SideNav';
import OrderDetail from './OrderDetail';
import SupplierAddingForm from './common/SupplierAddingForm';
/** other resource */
import editImg from '../../../img/editBtn.png';
import deleteImg from '../../../img/deleteBtn.png';

class OrderHistory extends Component{
    constructor(props){
        super(props);
        this.state={
            onSupplierAdding:false,
            isNeedUpdateFromDB:false,
            orderList:[]
        }
    }
    componentDidMount(){
        this.updateOrdersFromDB();
    }
    componentDidUpdate(){
        if(this.state.isNeedUpdateFromDB===true){
            this.updateOrdersFromDB();
        }
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
                    <OrderDetail shopUrl={this.props.shopUrl} shop={this.props.shop} id={orderid} 
                    updateOrdersFromDB={this.updateOrdersFromDB} />:
                    <div className="shopMainArea shopMainArea-purchase-orderHistory">
                        {/* 新增供應商 */}
                        {
                            onSupplierAdding?
                            <SupplierAddingForm shopRef={this.props.shop.shopRef} toggle={this.toggleSupplierAddingForm} />:null}
                        <div className="operatingArea">
                            <div className="currentInfo">
                                <div>歷史採購單列表</div>
                                <div>使用者：<span>{`${this.props.shop.user.name}`}</span></div>
                            </div>
                            <div className="operatingBtns">
                                <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/purchase/new`)}}>新增訂單</button>
                                <button className="btnForFormBig">庫存查詢</button>
                                <button className="btnForFormBig" onClick={()=>{
                                    this.toggleSupplierAddingForm(true)
                                }}>新增供應商</button>
                            </div>
                        </div>
                        <div className="informationArea">
                            <div className="filterBlock">
                                <div></div>
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
                                            <span>{order.sumOfCost}</span>
                                            <span>{order.sumOfNum}</span>
                                            <span>{order.avgProfit}</span>
                                            <span>{this.getDateToYMD(order.time.seconds)}</span>
                                            <span className="showPercentage">{this.showPercentage(order)}</span>
                                            <span>
                                            <img onClick={()=>{this.toDetailPage(order.id)}} src={editImg}/>
                                            <img onClick={()=>{this.deleteHoldOrder(order.id)}} src={deleteImg}/></span>
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
    updateOrdersFromDB=()=>{
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
                            isNeedUpdateFromDB:false,
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
    toggleSupplierAddingForm=(bool)=>{
        this.setState(preState=>({
            onSupplierAdding:bool,
        }))
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
    deleteHoldOrder=(orderid)=>{
        if(confirm(`確定刪除 ${orderid} 整筆訂單?`)){
            this.props.shop.shopRef.collection('purchases').doc(orderid).delete()
            .then(res=>{
                alert(`採購單 ${orderid} 刪除成功！`);
                this.setState(preState=>({
                    isNeedUpdateFromDB:true,
                }))
                return ;
            })
            .catch(error=>{
                console.error('ERROR\n刪除採購單時發生問題')
                console.log(error);
            })
        }
    }
}

export default OrderHistory;