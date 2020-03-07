import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt, getDateToYMD} from '../../lib';
import {createHashHistory as history} from 'history';
/** component */
import AppHeaderBar from '../common/AppHeaderBar';
import AppSideNav from '../common/AppSideNav';
import Checkbox from '../common/Checkbox'; 
import {Loading} from '../common/Loading';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class StockHistory extends Component{
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
    render(){
        let orderList=this.state.orderList;
        let selectOrder=this.state.selectOrder;
        return (
            <Fragment>
                <AppSideNav />
                <AppHeaderBar />
                <div className="app-pageMainArea app-stock-history">
                    <div className="app-pageMainArea-header">
                        <div className="location">
                            <div>歷史進退貨單紀錄</div>
                        </div>
                        <div className="operatingBtns">
                            <button className="fx-btn--mainColor" onClick={()=>{history().push(`/stock/stockin`)}}>進貨單登錄</button>
                            <button className="fx-btn--mainColor" onClick={()=>{history().push(`stock/return`)}}>退貨單登錄</button>
                            <button className="fx-btn--mainColor">商品庫存查詢</button>
                        </div>
                    </div>
                    <div className="app-pageMainArea-main">
                    {
                        !orderList?
                        <Loading text="歷史訂單載入中" />:
                        <div className="orderList">
                            <div className="orderList-search">
                                <div className="app-filter">
                                    <span className="app-filter-option">
                                        <Checkbox value={this.state.isSearchNeedPurchaseID} onClick={()=>{this.setState(preState=>({isSearchNeedPurchaseID:!preState.isSearchNeedPurchaseID}))}} />
                                        <label>採購單號</label>
                                        <input onChange={this.handleChange}  id="searchByPurchaseID" />
                                    </span>
                                    <span className="app-filter-option">
                                        <Checkbox value={this.state.isSearchNeedDateArea} onClick={()=>{this.setState(preState=>({isSearchNeedDateArea:!preState.isSearchNeedDateArea}))}} />
                                        <label>日期區間從</label>
                                        <input className="date" onChange={this.handleChange} type='date' id="searchByDateFrom" defaultValue={getDateToYMD(this.state.defaultSearchByDateFrom)}/>
                                        <label>至</label>
                                        <input className="date" onChange={this.handleChange}  type='date' id="searchByDateTo" defaultValue={getDateToYMD(this.state.defaultSearchByDateTo)} />
                                    </span>
                                    <span className="app-filter-actionBtn fx-btn--25LH-mainColor">搜尋</span>
                                </div>
                                <div className="orderList-search-result">
                                    <div className="title">進退貨單搜尋結果列表</div>
                                    <div className="content fk-table--black">
                                        <div className="fk-table-header">
                                            <span className="fk-table-cell-175px">進退貨單號</span>
                                            <span className="fk-table-cell-50px">類別</span>
                                            <span className="fk-table-cell-150px">時間</span>
                                        </div>
                                        {
                                            orderList.length===0?
                                            <div className="fk-table-highlighter">沒有查詢到符合條件的表單</div>:
                                            orderList.map((order,index)=>(
                                                <div key={index} 
                                                className={ `fk-table-row ${selectOrder&&selectOrder.id===order.id?'orderChoosed':null}` } 
                                                onClick={()=>{this.selectOrder(index)}} >
                                                    <span className="fk-table-cell-175px">{order.id}</span>
                                                    <span className="fk-table-cell-50px">{order.type==="stockin"?'進貨':'退貨'}</span>
                                                    <span className="fk-table-cell-150px">{getDateToYMD(order.time,true)}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="orderList-detail">
                                <div className="title">
                                {
                                    selectOrder?
                                    `詳細資訊 - ${selectOrder.type==='stockin'?'進貨單':'退貨單'} ${selectOrder.id}`:
                                    `詳細資訊 - 請選擇欲查看的進退貨單`
                                }
                                </div>
                                {
                                    selectOrder?
                                    <div className="content fk-table--black">
                                        <div className="fk-table-header">
                                            <span className="fk-table-cell-175px">商品編號</span>
                                            <span className="fk-table-cell-150px">商品名稱</span>
                                            <span className="fk-table-cell-50px">尺寸</span>
                                            <span className="fk-table-cell-50px">顏色</span>
                                            <span className="fk-table-cell-50px">總採購</span>
                                            <span className="fk-table-cell-50px">已入庫</span>
                                            <span className="fk-table-cell-100px">當次作業件數</span>
                                        </div>
                                        {
                                            selectOrder.stockInList.map((stockIn,index)=>(
                                            <Fragment key={index}>
                                                <div className="fk-table-row">
                                                    <span className="flag">{stockIn.purchaseID}</span>
                                                </div>
                                                {
                                                    stockIn.itemList.map((item,itemIndex)=>(
                                                        <div key={itemIndex} className="fk-table-row">
                                                            <span className="fk-table-cell-175px">{item.itemID}</span>
                                                            <span className="fk-table-cell-150px">{item.name}</span>
                                                            <span className="fk-table-cell-50px">{item.size}</span>
                                                            <span className="fk-table-cell-50px">{item.color}</span>
                                                            <span className="fk-table-cell-50px">{item.num}</span>
                                                            <span className="fk-table-cell-50px">{item.inStock}</span>
                                                            <span className="fk-table-cell-100px">{item.operateNum}</span>
                                                        </div>
                                                    ))
                                                }
                                            </Fragment>))
                                        }
                                    </div>:
                                    null
                                }
                            </div>
                        </div>
                    }
                    </div>
                </div>
            </Fragment>
        )
    }
    componentDidMount(){
        let orderList=[];
        let shopRef=this.props.shopRef;
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

export default StockHistory;