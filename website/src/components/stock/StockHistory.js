import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt, getDateToYMD} from '../../lib';
import {createHashHistory as history} from 'history';
/** component */
import AppHeaderBar from '../common/AppHeaderBar';
import AppSideNav from '../common/AppSideNav';
import Checkbox from '../common/Checkbox'; 
import {Loading} from '../common/Loading';
import StockChecker from '../common/StockChecker';
import StockOrderFilter from '../common/StockOrderFilter';
/** other resource */
import Triangle_White from '../../img/Triangle_White.png';

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
            paging:1,
            limitNum:20,
            previousScope:null,
            orderRef:this.props.shopRef.collection('stocks'),
            showStockChecker:false,
            isNeedUpdateFromDB:false,
            orderByDesc:true //asc
        }
    }
    render(){
        let orderList=this.state.orderList;
        let selectOrder=this.state.selectOrder;
        let descStyle={
            transform: 'rotate(180deg)'
        }
        return (
            <Fragment>
                <AppSideNav />
                <AppHeaderBar />
                <div className="app-pageMainArea app-stock-history">
                {
                    this.state.showStockChecker?
                    <StockChecker toggle={this.showStockChecker} callback={this.set}/>:
                    null
                }
                    <div className="app-pageMainArea-header">
                        <div className="location">
                            <div>歷史進退貨單紀錄</div>
                        </div>
                        <div className="operatingBtns">
                            <button className="fx-btn--mainColor" onClick={()=>{history().push(`/stock/stockin`)}}>進貨單登錄</button>
                            <button className="fx-btn--mainColor" onClick={()=>{history().push(`/stock/return`)}}>退貨單登錄</button>
                            <button className="fx-btn--mainColor" onClick={()=>{
                                this.showStockChecker(true);
                            }}>庫存查詢</button>
                        </div>
                    </div>
                    <div className="app-pageMainArea-main">
                    {
                        !orderList?
                        <Loading text="歷史訂單載入中" />:
                        <div className="orderList">
                            <div className="orderList-search">
                                <StockOrderFilter orderRef={this.state.orderRef} callback={this.setTargetRef}/>
                                <div className="orderList-search-result">
                                    <div className="title">進退貨單搜尋結果列表</div>
                                    <div className="orderList-search-result-content fk-table--black">
                                        <div className="fk-table-header">
                                            <span className="fk-table-cell-175px">進退貨單號</span>
                                            <span className="fk-table-cell-50px">類別</span>
                                            <span className="fk-table-cell-150px">
                                                <span>進退貨時間</span>
                                                <span onClick={this.toggleOrderByMode} style={this.state.orderByDesc?descStyle:null}
                                                className="fx-btn--Img-15px"><img src={Triangle_White}/></span>
                                            </span>
                                        </div>
                                        <div className="fk-table-scrollArea">
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
                                        {
                                            orderList!='loading'&&orderList.length!=0&&orderList.length<this.state.limitNum?
                                            <div className="fk-table-highlighter fk-table-row">-- 全 --</div>:
                                            null
                                        }
                                        </div>
                                    </div>
                                    <div className="orderList-search-result-footer">
                                        <div className="paging">
                                        {
                                            this.state.paging===1?
                                            <button className="fx-btn--unable-black">前一頁</button>:
                                            <button onClick={this.goPrePage} className="fx-btn--onlyText-black">前一頁</button>
                                        }
                                            <span>{this.state.paging}</span>
                                        {
                                            this.state.isNextPageExist?
                                            <button onClick={this.goNextPage} className="fx-btn--onlyText-black">下一頁</button>:
                                            <button className="fx-btn--unable-black">下一頁</button>
                                        }
                                        </div>
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
        this.setTargetRef(this.state.orderRef)
    }
    componentDidUpdate(){
        if(this.state.isNeedUpdateFromDB===true){
            this.getOrdersFromDB();
        }
    }
    showStockChecker=(bool)=>{
        this.setState(preState=>({
            showStockChecker:bool
        }));
    }
    toggleOrderByMode=()=>{
        this.setState(preState=>({
            orderByDesc:!preState.orderByDesc,
        }),()=>{this.getOrdersFromDB()})
    }
    setTargetRef=(targetRef)=>{
        this.setState(preState=>({
            paging:1, //reset paging
            targetRef,
            previousScope:null
        }),()=>{this.getOrdersFromDB()})
    }
    getOrdersFromDB=(changePage,goNext)=>{
        /** goNext true 下一頁 false 上一頁*/
        /** 時間採降序 */
        let TR=this.state.targetRef;
        let PS=this.state.previousScope;
        let PT=PS?goNext?PS[1]:PS[0]:null;
        let mode=this.state.orderByDesc?'desc':'asc';
        let limitNum=this.state.limitNum;
        let isNextPageExist=true;
        let paging=this.state.paging;
        let query=TR;
        let orderList=[];
        let previousScope=this.state.previousScope?this.state.previousScope:[];
        if(PT&&changePage){
            query=query.orderBy('time',`${mode}`).startAt(PT);
            paging=goNext?paging+1:paging-1;
        }else{
            query=query.orderBy('time',`${mode}`)
        }
        query.limit(limitNum).get()
        .then(snapshot=>{
            if(snapshot.empty){
                previousScope=null;
            }else{                
                snapshot.forEach(doc=>{
                    if(doc.exists){
                        let order=doc.data();
                        order.id=doc.id;
                        orderList.push(order);
                        if(paging===1&&orderList.length===1){
                            // 第一個
                            previousScope[0]=doc;
                        }else{
                            previousScope[1]=doc;
                        }
                    }
                })
            }
            if(orderList.length<limitNum){
                isNextPageExist=false;
            }
            this.setState(preState=>({
                paging,
                orderList,
                previousScope,
                isNextPageExist,
                isNeedUpdateFromDB:false
            }))
        })
        .catch(error=>{
            console.error("ERROR\n伺服器發生錯誤，目前無法獲取歷史訂單資料，請稍後再試")
            console.log(error);
        })
    }
    goPrePage=()=>{
        this.getOrdersFromDB(true,false);
    }
    goNextPage=()=>{
        this.getOrdersFromDB(true,true);
    }
    showStockChecker=(bool)=>{
        this.setState(preState=>({
            showStockChecker:bool
        }));
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState((preState)=>{
            return {
                [id]:value
            }
        });
    }
    selectOrder=(orderIndex)=>{
        let selectOrder=this.state.orderList[orderIndex];
        this.setState(preState=>({
            selectOrder
        }))
    }
}

export default StockHistory;