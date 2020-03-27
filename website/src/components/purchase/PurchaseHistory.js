import React,{Component, Fragment} from 'react';
import {createHashHistory as history} from 'history';
import {roundAfterPointAt, getDateToYMD} from '../../lib';
/** component */
import ShowPercentage from '../common/ShowPercentage'
import AppSideNav from '../common/AppSideNav';
import {Loading} from '../common/Loading';
import AppHeaderBar from '../common/AppHeaderBar';
import PurchaseOrderFilter from '../common/PurchaseOrderFilter';
import PurchaseDetail from './PurchaseDetail';
import {FormSupplierEntry} from '../common/Supplier';
/** other resource */
import editImg from '../../img/editBtn.png';
import deleteImg from '../../img/deleteBtn.png';
import Triangle_White from '../../img/Triangle_White.png';

class PurchaseHistory extends Component{
    constructor(props){
        super(props);
        this.state={
            paging:1,
            isNextPageExist:true,
            limitNum:20,
            onSupplierAdding:false,
            isNeedUpdateFromDB:false,
            orderByDesc:true, //asc
            orderList:'loading',
            orderRef:this.props.shopRef.collection('purchases'),
            /**
            targetRef
            previousScope
            */
        }
    }
    render(){
        let onSupplierAdding=this.state.onSupplierAdding;
        let orderList=this.state.orderList;
        let orderid=this.props.history.match.params.orderid;
        let descStyle={
            transform: 'rotate(180deg)',
        }
        return (
            <Fragment>
                <AppSideNav />
                <AppHeaderBar />
                {
                    orderid?
                    <PurchaseDetail shopRef={this.props.shopRef} shop={this.props.shop} id={orderid} 
                    getOrdersFromDB={this.getOrdersFromDB} />:
                    <div className="app-pageMainArea app-purchase-history">
                        {/* 新增供應商 */}
                        {
                            onSupplierAdding?
                            <FormSupplierEntry shopRef={this.props.shopRef} toggle={this.toggleSupplierAddingForm} />:
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
                            <div className="orderList-header">
                                <PurchaseOrderFilter orderRef={this.state.orderRef} callback={this.setTargetRef}/>
                            </div>
                            <div className="orderList-main fk-table--black">
                                <div className="fk-table-header">
                                    <span className="fk-table-cell-175px">訂單編號</span>
                                    <span className="fk-table-cell-100px">供應商</span>
                                    <span className="fk-table-cell-100px">成本總計</span>
                                    <span className="fk-table-cell-50px">總件數</span>
                                    <span className="fk-table-cell-100px">預估利潤</span>
                                    <span className="fk-table-cell-125px">
                                        <span>採購日期</span>
                                        <span onClick={this.toggleOrderByMode} style={this.state.orderByDesc?descStyle:null}
                                        className="fx-btn--Img-15px"><img src={Triangle_White}/></span>
                                    </span>
                                    <span className="fk-table-cell-125px">到貨進度</span>
                                    <span className="fk-table-floatR fk-table-cell-175px">操作</span>
                                </div>
                                <div className="fk-table-scrollArea">
                                {   
                                    orderList==='loading'?
                                    <Loading text="訂單列表載入中"/>:
                                    orderList.length===0?
                                    <div className="fk-table-highlighter fk-table-row">-- 沒有符合查詢條件的訂單 --</div>:
                                    orderList.map((order,index)=>{
                                        return (
                                            <div key={index} className="fk-table-row row">
                                                <span className="fk-table-cell-175px">{order.id}</span>
                                                <span className="fk-table-cell-100px">{order.supplierIdAndTitle[1]}</span>
                                                <span className="fk-table-cell-100px">{order.static.sumOfCost}</span>
                                                <span className="fk-table-cell-50px">{order.static.sumOfNum}</span>
                                                <span className="fk-table-cell-100px">{order.static.avgProfit}</span>
                                                <span className="fk-table-cell-125px">{getDateToYMD(order.time)}</span>
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
                                {
                                    orderList!='loading'&&orderList.length!=0&&orderList.length<this.state.limitNum?
                                    <div className="fk-table-highlighter fk-table-row">-- 全 --</div>:
                                    null
                                }
                                </div>
                            </div>
                            <div className="orderList-footer">
                                <div className="orderList-footer-page">
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
                }
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
    toggleOrderByMode=()=>{
        this.setState(preState=>({
            orderByDesc:!preState.orderByDesc,
        }),()=>{this.getOrdersFromDB()})
    }
    setTargetRef=(targetRef)=>{
        this.setState(preState=>({
            paging:1, //reset paging
            targetRef,
            previousScope:null,
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
                isNeedUpdateFromDB:false,
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
    toggleSupplierAddingForm=(bool)=>{
        this.setState(preState=>({
            onSupplierAdding:bool,
        }))
    }
    toDetailPage=(orderid)=>{
        history().push(`/purchase/history/${orderid}`);
    }
    deleteHoldOrder=(orderid)=>{
        if(confirm(`確定刪除 ${orderid} 整筆訂單?`)){
            let order=this.state.orderList.filter(order=>{
                return order.id===orderid;
            })
            let isStartStocking=false;
            search:
            for(let item of order[0].itemList){                
                if(item.inStock>0){
                    isStartStocking=true;
                    break search;
                }
            }
            if(!isStartStocking){
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
            }else{
                alert('此採購單存在已進貨商品，無法刪除');
            }
        }
    }
}

export default PurchaseHistory;