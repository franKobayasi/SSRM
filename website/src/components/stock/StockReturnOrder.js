import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt} from '../../lib';
import {createHashHistory as history} from 'history';
import {ssrmDB} from '../../useFirebase';
/** component */
import AppSideNav from '../common/AppSideNav';
import AppHeaderBar from '../common/AppHeaderBar';
import ItemSelector from './ItemSelector';
import StockChecker from '../common/StockChecker';
/** resource */
import deleteBtn from '../../img/deleteBtn.png';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class StockReturnOrder extends Component{
    constructor(props){
        super(props);
        this.state={
            isShowSearchPanel:false,
            currentOrder:'loading',
            localStorageLock:true,
            showStockChecker:false
        }
    }
    render(){
        let currentOrder=this.state.currentOrder;
        return (
            <Fragment>
                <AppSideNav />
                <AppHeaderBar />
                <div className="app-pageMainArea app-stock-return">
                {
                    this.state.showStockChecker?
                    <StockChecker toggle={this.showStockChecker}/>:
                    null
                }
                    <div className="app-pageMainArea-header">
                        <div className="location">
                            <div>位置：退貨單登錄</div>
                        </div>
                        <div className="operatingBtns">
                            <button className="fx-btn--mainColor" onClick={()=>{history().push(`/stock/history`)}}>歷史進退貨單</button>
                            <button className="fx-btn--mainColor" onClick={()=>{
                                this.showStockChecker(true);
                            }}>庫存查詢</button>
                        </div>
                    </div>
                    <div className="app-pageMainArea-main">
                        <div className="orderContent">
                            <div className="orderContent-header">
                                <span className="orderID">{`退貨單號：${currentOrder.id}`}</span>
                            </div>
                            <div className="orderContent-main fk-table">
                                <div className="fk-table-header">
                                    <span className="fk-table-cell-175px">產品編號</span>
                                    <span className="fk-table-cell-150px">產品名稱</span>
                                    <span className="fk-table-cell-50px">尺寸</span>
                                    <span className="fk-table-cell-50px">顏色</span>
                                    <span className="fk-table-cell-50px">總採購</span>
                                    <span className="fk-table-cell-50px">已入庫</span>
                                    <span className="fk-table-cell-75x flag">本次退回</span>
                                </div>
                                <div className="fk-table-scrollArea">
                                {   
                                currentOrder.stockInList&&currentOrder.stockInList.length>0?
                                currentOrder.stockInList.map((order,orderIndex)=>(
                                <Fragment key={orderIndex}>
                                    <div className="fk-table-row">
                                        <span className="flag">{`採購單號：${order.purchaseID}`}</span>
                                    </div>
                                    {
                                    order.itemList.map((item,itemIndex)=>(
                                        <div key={itemIndex} className="fk-table-row">
                                            <span className="fk-table-cell-175px">{item.itemID}</span>
                                            <span className="fk-table-cell-150px">{item.name}</span>
                                            <span className="fk-table-cell-50px">{item.size}</span>
                                            <span className="fk-table-cell-50px">{item.color}</span>
                                            <span className="fk-table-cell-50px">{item.num}</span>
                                            <span className="fk-table-cell-50px">{item.inStock}</span>
                                            <input className="fk-table-cell-50px flag" onChange={(evnt)=>{evnt.persist(); this.setOperateNum(evnt,orderIndex,itemIndex)}} 
                                                value={item.operateNum} ></input>
                                            <span className="flag"> Pcs</span>        
                                            <span className="fx-btn--Img-25px">
                                                <img onClick={()=>{this.deleteItem(orderIndex,itemIndex)}} src={deleteBtn} />
                                            </span>
                                        </div>
                                    ))
                                    }
                                </Fragment>
                                )):<div className="fk-table-highlighter">尚未新增任何產品</div>
                                }
                                </div>
                            </div>
                            <div className="orderContent-footer">
                                <div className="actionBtns">
                                    <button className="fx-btn--25LH-mainColor" onClick={this.submitOrder}>商品退庫</button>
                                    <button className="fx-btn--25LH-mainColor" onClick={this.cancelOrder}>取消操作</button>
                                </div>
                            </div>
                        </div>
                        <ItemSelector orderType={currentOrder.type} callback={this.addItemList} shopRef={this.props.shopRef} />
                    </div>
                </div>
            </Fragment>
        )
    }
    componentDidMount(){
        let uncompletedNewOrder;
        let currentOrder;
        let shopID=this.props.shopRef.id;
        uncompletedNewOrder=JSON.parse(localStorage.getItem(`shop-${shopID}-new-stockReturn-order`));
        if(!uncompletedNewOrder){
            currentOrder=this.createNewOrder();
            localStorage.setItem(`shop-${shopID}-new-stockReturn-order`,JSON.stringify(currentOrder)); 
        }else{
            currentOrder=uncompletedNewOrder;
        }
        this.setState(preState=>({
            currentOrder
        }))   
    }
    componentDidUpdate(){
        /** auto upadte order to localStorage */
        if(!this.state.localStorageLock){
            let shopID=this.props.shopRef.id;
            localStorage.setItem(`shop-${shopID}-new-stockReturn-order`,JSON.stringify(this.state.currentOrder))
            this.setState(preState=>({
                localStorageLock:true
            }))
        }
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
    searchPanelToggle=()=>{
        this.setState(preState=>({
            isShowSearchPanel:!preState.isShowSearchPanel
        }))
    }
    createNewOrder(){
        return {
            id:`${randomStockOrderID()}`,
            stockInList:[],
            search_purchaseID:[],
            type:'return'
        };
    }
    addItemList=(order)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        let stockInList=currentOrder.stockInList;
        let isOrderAlreadyAdd=false;
        let targetIndex;
        for(let orderIndex in stockInList){
            if(stockInList[orderIndex].purchaseID===order.purchaseID){
                isOrderAlreadyAdd=true;
                targetIndex=orderIndex;
                for(let itemIndex in stockInList[orderIndex].itemList){
                    for(let index in order.itemList){                      
                        if(stockInList[orderIndex].itemList[itemIndex].itemID===order.itemList[index].itemID){
                            order.itemList.splice(index,1);
                        }
                    }
                }
            }
        }
        if(!isOrderAlreadyAdd){
            currentOrder.search_purchaseID.push(order.purchaseID);
            currentOrder.stockInList.push({
                purchaseID:order.purchaseID,
                itemList:order.itemList,
                updateTimes:order.updateTimes
            });
        }else{
            currentOrder.stockInList[targetIndex].itemList=currentOrder.stockInList[targetIndex].itemList.concat(order.itemList);
        }
        this.setState(preState=>({
            currentOrder,
            localStorageLock:false
        }))
    }
    deleteItem=(orderIndex,itemIndex)=>{
        if(confirm('移除此筆商品?')){
            let currentOrder=Object.assign({},this.state.currentOrder);
            currentOrder.stockInList[orderIndex].itemList.splice(itemIndex,1);
            if(currentOrder.stockInList[orderIndex].itemList.length===0){
                currentOrder.search_purchaseID.splice(orderIndex,1);
                currentOrder.stockInList.splice(orderIndex,1);
            }
            this.setState(preState=>({
                currentOrder,
                localStorageLock:false
            }))
        }
    }
    setOperateNum=(evnt,orderIndex,itemIndex)=>{
        let value=evnt.target.value;
        let currentOrder=Object.assign({},this.state.currentOrder);
        let item=currentOrder.stockInList[orderIndex].itemList[itemIndex];
        value=Number(value>item.inStock?item.inStock:value);
        if(String(Number(value))==="NaN"){
            value=item.inStock;
        }
        currentOrder.stockInList[orderIndex].itemList[itemIndex].operateNum=value;
        this.setState(preState=>({
            currentOrder
        }))
    }
    /**
    新增進貨單到資料庫，同時新增產品庫存到產品collection，最後更新各採購單的狀態
    */
    submitOrder=async()=>{
        let shopRef=this.props.shopRef;
        let currentOrder=this.state.currentOrder;
        let isAllOperateNumKeyIn=true;
        let changedOrder=[];
        /** 確認是否已輸入數量 */
        search:
        for(let order of currentOrder.stockInList){
            for(let item of order.itemList){
                if(item.operateNum===0){
                    isAllOperateNumKeyIn=false;
                    break search;
                }   
            }
        }
        // check 是否有採購單更動
        let checkAll=[];
        for(let order of currentOrder.stockInList){
            let check=shopRef.collection('purchases').doc(order.purchaseID).get()
            .then(doc=>{
                let orderData=doc.data();
                if(order.updateTimes!=orderData.updateTimes){
                    changedOrder.push(order.id);
                }
            })
            checkAll.push(check);
        }
        await Promise.all(checkAll);
        if(changedOrder.length>0){
            let order=Object.assign({},currentOrder);
            order.stockInList=order.stockInList.filter(stockIn=>{
                return !changedOrder.includes(stockIn.purchaseID)
            })
            this.setState(preState=>({
                currentOrder:order,
                localStorageLock:false
            }))
            alert(`移除已發生變更的採購單，請重新查詢`);
            return ;
        }
        if(isAllOperateNumKeyIn){
            currentOrder.time=new Date().valueOf();
            /** 退貨作業 */            
            let transaction=ssrmDB.runTransaction(t=>{
                let allUpdate=[];
                for(let stockIn of currentOrder.stockInList){
                /** 更新此進貨單所需更新的採購單資料 */
                    let purchaseOrderUpdate=t.get(shopRef.collection('purchases').doc(stockIn.purchaseID))
                    .then(doc=>{
                        let TPO=doc.data();/** Target Purchase Order */
                        TPO.itemList=TPO.itemList.map(itemTPO=>{
                            for(let item of stockIn.itemList){
                                if(item.itemID===itemTPO.itemID){
                                    /** 更新 inStock Num */
                                    itemTPO.inStock-=item.operateNum;
                                    if(itemTPO.inStock===itemTPO.num){
                                        itemTPO.status='finish';
                                    }else if(itemTPO.inStock===0){
                                        itemTPO.status='purchase';
                                    }else{
                                        itemTPO.status='stocking';
                                    }
                                }
                            }
                            return itemTPO;
                        })
                        TPO.updateTimes+=1;
                        t.set(shopRef.collection('purchases').doc(stockIn.purchaseID),TPO);
                    })
                    allUpdate.push(purchaseOrderUpdate);
                    for(let item of stockIn.itemList){
                        /** 更新產品庫存數量 */
                        let productsUpdate=t.get(shopRef.collection('products').doc(item.itemID))
                        .then(doc=>{
                            let itemData;
                            if(doc.exists){
                                itemData=doc.data();
                                itemData.stocks-=item.operateNum;
                                t.set(shopRef.collection('products').doc(item.itemID),itemData);
                            }
                        })
                        allUpdate.push(productsUpdate);
                    }
                }
                return Promise.all(allUpdate);
            })
            .then(result=>{
                /** 新增進貨單到資料庫 */
                shopRef.collection('stocks').doc(currentOrder.id).set(currentOrder);
                alert('退貨作業成功完成！');
                /** 清空currentOrder */
                this.setState(preState=>({
                    currentOrder:this.createNewOrder(),
                    localStorageLock:false
                }))
            })
            .catch(error=>{
                console.error(`退貨作業失敗！\n${error}`);
            })
        }else{
            alert('尚有有未輸入退貨數量的商品');
        }
    }
    cancelOrder=()=>{
        if(confirm('尚有未送出的資料，確定取消？')){
            this.setState(preState=>({
                currentOrder:this.createNewOrder(),
                localStorageLock:false
            }))
        }
    }
}

export default StockReturnOrder;