import React, {Component,Fragment} from "react";
import {ssrmDB} from '../../useFirebase';
import {getDateToYMD} from '../../lib';
import AppHeaderBar from '../common/AppHeaderBar';
import AppSideNav from '../common/AppSideNav';
import {Loading} from '../common/Loading';
import CheckoutOrderFilter from '../common/CheckoutOrderFilter';
import CheckoutCreate from './CheckoutCreate';

/** img */
import editBtn from '../../img/editBtn.png';
import deleteBtn from '../../img/deleteBtn.png';
import Triangle_White from '../../img/Triangle_White.png';

class CheckoutHistory extends Component{
    constructor(props){
        super(props);
        this.state={
            orderList:'loading',
            isNextPageExist:true,
            limitNum:20,
            orderRef:this.props.shopRef.collection('checkouts'),
            orderByDesc:'desc',
            paging:1,
            //targetRef,previousScope
        }
    }
    render(){
        let orderList=this.state.orderList;
        let descStyle={
            transform: 'rotate(180deg)',
        }
        return (
            <div className="app-pageMainArea app-checkout-history">
                <div className="app-pageMainArea-header">
                    <div className="location">
                        <div>位置：結帳歷史紀錄</div>
                    </div>
                    <div className="operatingBtns">
                        <button className="fx-btn--mainColor" onClick={()=>{this.props.history.history.push('/checkout/new')}}>返回結帳台</button>
                    </div>
                </div>
                <div className="app-pageMainArea-main">
                    <div className="orderList">
                        <div className="orderList-header">
                            <CheckoutOrderFilter callback={this.setTargetRef} orderRef={this.state.orderRef} />
                        </div>
                        <div className="orderList-main fk-table--black">
                            <div className="fk-table-header">
                                <span className="fk-table-cell-175px">結帳單號</span>
                                <span className="fk-table-cell-125px">顧客名稱</span>
                                <span className="fk-table-cell-75px">件數</span>
                                <span className="fk-table-cell-75px">應收</span>
                                <span className="fk-table-cell-75px">折扣</span>
                                <span className="fk-table-cell-75px">訂金</span>
                                <span className="fk-table-cell-75px">實收</span>
                                <span className="fk-table-cell-75px">狀態</span>
                                <span className="fk-table-cell-125px">
                                        <span>結帳時間</span>
                                        <span onClick={this.toggleOrderByMode} style={this.state.orderByDesc?descStyle:null}
                                        className="fx-btn--Img-15px"><img src={Triangle_White}/></span>
                                    </span>
                                <span className="fk-table-cell-175px fk-table-floatR">操作</span>
                            </div>
                            <div className="fk-table-scrollArea">
                        {
                            orderList==='loading'?
                            <Loading text="結帳紀錄載入中"/>:
                            orderList.length===0?
                            <div className="fk-table-highlighter">無符合查詢的交易資料</div>:
                            orderList.map((order,index)=>(
                                <div key={index} className="fk-table-row">
                                    <span className="fk-table-cell-175px">{order.id}</span>
                                    <span className="fk-table-cell-125px">{order.customer[0]}</span>
                                    <span className="fk-table-cell-75px">{order.calcResult.sumOfNum}</span>
                                    <span className="fk-table-cell-75px">{order.calcResult.sumOfMoney}</span>
                                    <span className="fk-table-cell-75px">{order.calcResult.discount}</span>
                                    <span className="fk-table-cell-75px">{order.calcResult.deposit}</span>
                                    <span className="fk-table-cell-75px">{order.calcResult.receive}</span>
                                    <span className="fk-table-cell-75px">{
                                        order.status==='done'?
                                        '已完成':
                                        order.status==='undone'?
                                        '未結暫存':
                                        '已付訂金'
                                    }</span>
                                    <span className="fk-table-cell-125px">{getDateToYMD(order.time)}</span>
                                    <span className="fk-table-cell-175px fk-table-floatR">
                                        <span onClick={()=>{this.toDetailPage(order.id)}} className="fx-btn--Img-25px"><img src={editBtn}/></span>
                                        <span onClick={()=>{this.deleteCheckout(order.id)}} className="fx-btn--Img-25px"><img src={deleteBtn}/></span>
                                    </span>
                                </div>
                            ))
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
            </div>
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
        console.log(targetRef);
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
        console.log(PT,changePage);
        if(PT&&changePage){
            console.log('CP?')
            query=query.orderBy('time',`${mode}`).startAt(PT);
            paging=goNext?paging+1:paging-1;
        }else{
            query=query.orderBy('time',`${mode}`)
        }
        query.limit(limitNum).get()
        .then(snapshot=>{
            if(snapshot.empty){
                console.log('no any purchase history yet')
                previousScope=null;
            }else{                
                snapshot.forEach(doc=>{
                    if(doc.exists){
                        let order=doc.data();
                        order.id=doc.id;
                        orderList.push(order);
                        if(paging===1&&orderList.length===1){
                            // 第一個
                            console.log(paging);
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
            console.log(paging);
            this.setState(preState=>({
                paging,
                orderList,
                previousScope,
                isNextPageExist,
                isNeedUpdateFromDB:false,
            }))
        })
        .catch(error=>{
            console.error("ERROR\n伺服器發生錯誤，目前無法獲取歷史結帳資料，請稍後再試")
            console.log(error);
        })
    }
    goPrePage=()=>{
        this.getOrdersFromDB(true,false);
    }
    goNextPage=()=>{
        this.getOrdersFromDB(true,true);
    }
    toDetailPage=(orderid)=>{
        this.props.history.history.push(`/checkout/history/${orderid}`);
    }
    deleteCheckout=(orderid)=>{
        if(confirm(`確定刪除 ${orderid} 該筆交易?`)){
            let order=this.state.orderList.filter(order=>{
                return order.id===orderid;
            })[0];
            let shopRef=this.props.shopRef;
            let promises=[];
            let transaction=ssrmDB.runTransaction(t=>{
                for(let item of order.itemList){
                    let itemUpdate=t.get(shopRef.collection('products').doc(item.itemID))
                    .then(doc=>{
                        let product=doc.data();
                        product.stocks+=item.saleNum;
                        t.set(shopRef.collection('products').doc(item.itemID),product)
                    })
                    .catch(error=>{
                        console.log('ERROR\n產品庫存更新失敗');
                        console.error(error);
                    })
                    promises.push(itemUpdate); //加回庫存
                    let tradeRecordsUpdate=t.get(shopRef.collection('customers').doc(order.customer[1]))
                    .then(doc=>{
                        let customer=doc.data();
                        delete customer.tradeRecords[order.id];
                        t.set(shopRef.collection('customers').doc(order.customer[1]),customer)
                    })
                    .catch(error=>{
                        console.log('ERROR\n顧客交易紀錄，更新失敗');
                        console.error(error);
                    })
                    promises.push(tradeRecordsUpdate); //更新顧客交易紀錄   
                }
                let deleteOrder=t.delete(shopRef.collection('checkouts').doc(order.id));
                promises.push(deleteOrder);
                return Promise.all(promises);
            })
            .then(res=>{
                alert(`交易 ${orderid} 取消成功！`);
                this.setState(preState=>({
                    isNeedUpdateFromDB:true,
                }))
            })
            .catch(error=>{
                console.error('ERROR\n刪除取消交易紀錄時發生錯誤');
                console.log(error);
            }) 
        }
    }
    
}

export default CheckoutHistory;
