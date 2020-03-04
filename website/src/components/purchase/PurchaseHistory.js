import React,{Component, Fragment} from 'react';
import {createHashHistory as history} from 'history';
import {roundAfterPointAt, getDateToYMD} from '../../lib';
/** component */
import ShowPercentage from '../common/ShowPercentage'
import AppSideNav from '../common/AppSideNav';
import AppHeaderBar from '../common/AppHeaderBar';
import PurchaseOrderFilter from '../common/PurchaseOrderFilter';
import PurchaseDetail from './PurchaseDetail';
import Supplier from './Supplier';
/** other resource */
import editImg from '../../img/editBtn.png';
import deleteImg from '../../img/deleteBtn.png';

class PurchaseHistory extends Component{
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
        let orderid=this.props.history.match.params.orderid;
        return (
            <Fragment>
                <AppSideNav />
                <AppHeaderBar />
                {
                    orderid?
                    <OrderDetail shopRef={this.props.shopRef} shop={this.props.shop} id={orderid} 
                    updateOrdersFromDB={this.updateOrdersFromDB} />:
                    <div className="app-pageMainArea app-purchase-history">
                        {/* 新增供應商 */}
                        {
                            onSupplierAdding?
                            <Supplier shopRef={this.props.shopRef} toggle={this.toggleSupplierAddingForm} />:
                            null
                        }
                        <div className="app-pageMainArea-header">
                            <div className="location">歷史採購單列表</div>
                            <div className="operatingBtns">
                                <button className="fx-btn--mainColor" onClick={()=>{history().push(`/purchase/new`)}}>新增訂單</button>
                                <button className="fx-btn--mainColor">庫存查詢</button>
                                <button className="fx-btn--mainColor" onClick={()=>{
                                    this.toggleSupplierAddingForm(true)
                                }}>新增供應商</button>
                            </div>
                        </div>
                        <div className="app-pageMainArea-main orderList">
                            <div className="orderList-filter">
                                <PurchaseOrderFilter />
                            </div>
                            <div className="orderList-table fk-table--black">
                                <div className="fk-table-header">
                                    <span className="fk-table-cell-175px">訂單編號</span>
                                    <span className="fk-table-cell-100px">供應商</span>
                                    <span className="fk-table-cell-100px">成本總計</span>
                                    <span className="fk-table-cell-50px">總件數</span>
                                    <span className="fk-table-cell-100px">預估利潤</span>
                                    <span className="fk-table-cell-125px">採購日期</span>
                                    <span className="fk-table-cell-125px">到貨進度</span>
                                    <span className="fk-table-floatR fk-table-cell-175px">操作</span>
                                </div>
                                <div className="fk-table-scrollArea">
                                {   
                                    orderList.length===0?
                                    <div className="fk-table-row row">目前沒有符合查詢條件的訂單</div>:
                                    orderList.map((order,index)=>{
                                        return (
                                            <div key={index} className="fk-table-row row">
                                                <span className="fk-table-cell-175px">{order.id}</span>
                                                <span className="fk-table-cell-100px">{order.search_supplier[0]}</span>
                                                <span className="fk-table-cell-100px">{order.static.sumOfCost}</span>
                                                <span className="fk-table-cell-50px">{order.static.sumOfNum}</span>
                                                <span className="fk-table-cell-100px">{order.static.avgProfit}</span>
                                                <span className="fk-table-cell-125px">{getDateToYMD(order.time,true)}</span>
                                                <span className="fk-table-cell-125px fk-table-LH0"><ShowPercentage order={order} /></span>
                                                <span className="fk-table-floatR fk-table-cell-175px">
                                                    <span className="fx-btn--Img-25px">
                                                        <img onClick={()=>{this.toDetailPage(order.id)}} src={editImg}/>
                                                    </span>
                                                    <span className="fx-btn--Img-25px">
                                                        <img onClick={()=>{this.deleteHoldOrder(order.id)}} src={deleteImg}/>
                                                    </span>
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }
    updateOrdersFromDB=()=>{
        this.props.shopRef.collection('purchases').get()
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
    /** 進貨完成度 */
    toDetailPage=(orderid)=>{
        history().push(`/purchase/history/${orderid}`);
    }
    deleteHoldOrder=(orderid)=>{
        if(confirm(`確定刪除 ${orderid} 整筆訂單?`)){
            this.props.shopRef.collection('purchases').doc(orderid).delete()
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

export default PurchaseHistory;