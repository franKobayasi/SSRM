import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
import {getDateToYMD} from '../../../lib';
/** component */
import SideNav from '../../layout/SideNav';
import Checkbox from '../common/Checkbox';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class OrderHistory extends Component{
    constructor(props){
        super(props);
        let to=new Date().valueOf();
        let from=new Date(to-(24*60*60*1000*14)).valueOf();
        this.state={
            orderList:null,
            preOderTime:0,
            isSearchNeedPurchaseID:false,
            isSearchNeedDateArea:true,
            defaultSearchByDateFrom:from,
            defaultSearchByDateTo:to,
            searchByDateFrom:'',
            searchByDateTo:'',
            searchByPurchaseID:'',
        }
    }
    componentDidMount(){
        let orderList=[];
        let shopRef=this.props.shop.shopRef;
        shopRef.collection('stocks').orderBy('time','desc').limit(10).get()
        .then(snapshot=>{
            if(snapshot.empty){
                this.setState(preState=>({
                    orderList,
                }))
            }else{
                snapshot.forEach(doc=>{
                    orderList.push(doc.data());
                });
                let preOderTime=orderList[orderList.length-1].time;
                this.setState(preState=>({
                    orderList,
                    preOderTime,
                }))
            }
        })
    }
    componentDidUpdate(){

    }
    render(){
        let orderList=this.state.orderList;
        let selectOrder=this.state.selectOrder;
        return (
            <Fragment>
                <SideNav />
                <div className="shopMainArea shopMainArea-stock-orderHistory">
                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>歷史進退貨單紀錄</div>
                            <div><span>{`使用者：${this.props.shop.user.name}`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/stock/new/stockin`)}}>進貨單登錄</button>
                            <button className="btnForFormBig">商品庫存查詢</button>
                        </div>
                    </div>
                    {
                        !orderList?
                        <div>loading...</div>:
                        <div className="informationArea">
                            <div className="orderSearch">
                                <div className="filter">
                                    <span className="searchBtn btnForFormLittle">搜尋</span>
                                    <span><Checkbox value={this.state.isSearchNeedPurchaseID} onClick={()=>{this.setState(preState=>({isSearchNeedPurchaseID:!preState.isSearchNeedPurchaseID}))}} /><label>採購單號</label>
                                    <input onChange={this.handleChange}  id="searchByPurchaseID" /></span>
                                    <span>
                                        <Checkbox value={this.state.isSearchNeedDateArea} onClick={()=>{this.setState(preState=>({isSearchNeedDateArea:!preState.isSearchNeedDateArea}))}} /><label>日期區間從</label>
                                        <input className="fromDate" onChange={this.handleChange} type='date' id="searchByDateFrom" defaultValue={getDateToYMD(this.state.defaultSearchByDateFrom)}/>
                                        <label className="toDate">至</label>
                                        <input onChange={this.handleChange}  type='date' id="searchByDateTo" defaultValue={getDateToYMD(this.state.defaultSearchByDateTo)} />
                                    </span>
                                </div>
                                <div className="table">
                                    <div className="head">
                                        <span className="orderID">進退貨單號</span>
                                        <span className="itemSpec">類別</span>
                                        <span className="date">時間</span>
                                    </div>
                                    {orderList.length===0?
                                    <div className="note_No_item">沒有查詢到符合條件的表單</div>:
                                    orderList.map((order,index)=>(
                                        <div key={index} className="btn row" onClick={()=>{this.selectOrder(index)}} >
                                            <span className="orderID">{order.id}</span>
                                            <span className="itemSpec">{order.type==="stockin"?'進貨':'退貨'}</span>
                                            <span className="date">{getDateToYMD(order.time,true)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="orderDetail">
                                <div className="table">
                                    <div className="basicInfo">
                                        <span className="orderID">{`單號：${selectOrder?selectOrder.id:''}`}</span>
                                        <span className="type">{`類型：${selectOrder?(selectOrder.type==='stockin'?'入庫':'退貨'):''}`}</span>
                                        <span className="buildDate">{`時間：${selectOrder?getDateToYMD(selectOrder.time,true):''}`}</span>
                                    </div>                                    
                                {
                                    !selectOrder?
                                    <div className="note_No_item">尚未選取任何訂單</div>:
                                    selectOrder.stockInList.map((stockIn,index)=>(
                                        <Fragment key={index}>
                                            <div className="row">
                                                <span className="orderID">{stockIn.purchaseID}</span>
                                            </div>
                                            <div className="row">
                                                <span className="itemID">商品編號</span>
                                                <span className="productName">商品名稱</span>
                                                <span className="itemSpec">尺寸</span>
                                                <span className="itemSpec">顏色</span>
                                                <span className="itemSpec">總採購</span>
                                                <span className="itemSpec">已入庫</span>
                                                <span className="stockIn">當次作業件數</span>
                                            </div>
                                            {
                                                stockIn.itemList.map((item,itemIndex)=>(
                                                    <div key={itemIndex} className="row">
                                                        <span className="itemID">{item.itemID}</span>
                                                        <span className="productName">{item.name}</span>
                                                        <span className="itemSpec">{item.size}</span>
                                                        <span className="itemSpec">{item.color}</span>
                                                        <span className="itemSpec">{item.num}</span>
                                                        <span className="itemSpec">{item.inStock}</span>
                                                        <span className="stockIn">{item.operateNum}</span>
                                                    </div>
                                                ))
                                            }
                                        </Fragment>
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </Fragment>
        )
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
    selectOrder=(orderIndex)=>{
        let selectOrder=this.state.orderList[orderIndex];
        this.setState(preState=>({
            selectOrder,
        }))
    }
}

export default OrderHistory;