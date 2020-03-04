import React,{Component, Fragment} from 'react';
import {createHashHistory as history} from 'history';
import {roundAfterPointAt} from '../../../lib';
/** component */
import SideNav from '../../layout/SideNav';
import OrderDetail from './OrderDetail';
import Supplier from './common/Supplier';
import ShowPercentage from '../common/ShowPercentage'
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
                            <Supplier shopRef={this.props.shop.shopRef} toggle={this.toggleSupplierAddingForm} />:null}
                        <div className="operatingArea">
                            <div className="currentInfo">
                                <div>歷史採購單列表</div>
                                <div><span>{`使用者：${this.props.shop.user.name}`}</span></div>
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
                            <div className="table fk-table-flex--LH25px">
                                <div className="fk-table-header fk-table-row row">
                                    <span className="fk-table-cell-175px">訂單編號</span>
                                    <span className="fk-table-cell-100px">供應商</span>
                                    <span className="fk-table-cell-100px">成本總計</span>
                                    <span className="fk-table-cell-75px">件數總計</span>
                                    <span className="fk-table-cell-100px">平均利潤</span>
                                    <span className="fk-table-cell-125px">採購日期</span>
                                    <span className="fk-table-cell-125px">到貨進度</span>
                                    <span className="tableBtnBox">操作</span>
                                </div>
                                {   
                                    orderList.length===0?
                                    <div className="fk-table-row row">目前沒有符合查詢條件的訂單</div>:
                                    orderList.map((order,index)=>{
                                    return (
                                        <div key={index} className="fk-table-row row">
                                            <span className="fk-table-cell-175px">{order.id}</span>
                                            <span className="fk-table-cell-100px">{order.search_supplier[0]}</span>
                                            <span className="fk-table-cell-100px">{order.static.sumOfCost}</span>
                                            <span className="fk-table-cell-75px">{order.static.sumOfNum}</span>
                                            <span className="fk-table-cell-100px">{order.static.avgProfit}</span>
                                            <span className="fk-table-cell-125px">{this.getDateToYMD(order.time)}</span>
                                            <span className="fk-table-cell-125px"><ShowPercentage order={order} /></span>
                                            <span className="tableBtnBox">
                                                <img className="defaultStyleBtn" onClick={()=>{this.toDetailPage(order.id)}} src={editImg}/>
                                                <img className="defaultStyleBtn" onClick={()=>{this.deleteHoldOrder(order.id)}} src={deleteImg}/>
                                            </span>
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
        this.props.shop.shopRef.collection('purchases').get()
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
    getDateToYMD(millseconds){
        let date=new Date(millseconds);
        let year=`${date.getFullYear()}`;
        let month=date.getMonth()<9?`0${date.getMonth()+1}`:`${date.getMonth()+1}`;
        let day=date.getDate()<10?`0${date.getDate()}`:`${date.getDate()}`;
        let hour=date.getHours()<10?`0${date.getHours()}`:`${date.getHours()}`;
        let minute=date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`;
        return `${year}/${month}/${day} ${hour}:${minute}`
    }
    /** 進貨完成度 */
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