import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
import {ssrmDB} from '../../../useFirebase';
/** component */
import SideNav from '../../layout/SideNav';
import ItemSelector from './ItemSelector'
/** resource */
import deleteBtn from '../../../img/deleteBtn.png';

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
        }
    }
    componentDidMount(){
        let uncompletedNewOrder;
        let currentOrder;
        uncompletedNewOrder=JSON.parse(localStorage.getItem('uncompleted-stock-return-newOrder'));
        if(!uncompletedNewOrder){
            currentOrder=this.createNewOrder();
            localStorage.setItem('uncompleted-stock-return-newOrder',JSON.stringify(currentOrder)); 
        }else{
            currentOrder=uncompletedNewOrder;
        }
        this.setState(preState=>({
            currentOrder,
        }))   
    }
    componentDidUpdate(){
        /** auto upadte order to localStorage */
        if(!this.state.localStorageLock){
            localStorage.setItem('uncompleted-stock-stockin-newOrder',JSON.stringify(this.state.currentOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
            console.log('update to local');
        }
    }
    render(){
        let currentOrder=this.state.currentOrder;
        return (
            <Fragment>
                <SideNav />
                <div className="shopMainArea shopMainArea-stock-orderCreating">
                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>退貨單登錄</div>
                            <div><span>{`使用者：${this.props.shop.user.name}`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/stock/history`)}}>歷史進退貨單</button>
                            <button className="btnForFormBig">庫存查詢</button>
                        </div>
                    </div>
                    <div className="informationArea">
                        <div className="stockProcessArea">
                            <div className="basicInfoArea">
                                <span className="orderID">{`退貨單號：${currentOrder.id}`}</span>
                                <span className="searchToggle" onClick={this.searchPanelToggle}>
                                    <span>採購單查詢面板</span>
                                    <span className="btn">{this.state.isShowSearchPanel?'OPEN':'CLOSE'}</span>
                                </span>
                            </div>
                            <div className="table">
                                <div className="head">
                                    <span className="itemID">產品編號</span>
                                    <span className="productName">產品名稱</span>
                                    <span className="itemSpec">尺寸</span>
                                    <span className="itemSpec">顏色</span>
                                    <span className="itemSpec">總採購</span>
                                    <span className="itemSpec">未入庫</span>
                                    <span className="stockIn">本次入庫</span>
                                </div>
                                <div className="scrollArea">
                                {   
                                currentOrder.stockInList&&currentOrder.stockInList.length>0?
                                currentOrder.stockInList.map((order,orderIndex)=>(
                                <div key={orderIndex} className="table">
                                    <div className="row">
                                        <span className="rowFlag">{`採購單號：${order.purchaseID}`}</span>
                                    </div>
                                    {
                                    order.itemList.map((item,itemIndex)=>(
                                        <div key={itemIndex} className="row">
                                            <span className="itemID">{item.itemID}</span>
                                            <span className="productName">{item.name}</span>
                                            <span className="itemSpec">{item.size}</span>
                                            <span className="itemSpec">{item.color}</span>
                                            <span className="itemSpec">{item.num}</span>
                                            <span className="itemSpec">{item.num-item.inStock}</span>
                                            <span className="stockIn">
                                                <input onChange={(evnt)=>{evnt.persist(); this.setOperateNum(evnt,orderIndex,itemIndex)}} 
                                                value={item.operateNum} ></input>
                                                <span className="pcs"> Pcs</span>
                                            </span>                                                
                                            <span className="btns">
                                                <img onClick={()=>{this.deleteItem(orderIndex,itemIndex)}} className="defaultStyleBtn" src={deleteBtn} />
                                            </span>
                                        </div>
                                    ))
                                    }
                                </div>
                                )):<div className="note_No_item">尚未新增任何產品</div>
                                }
                                </div>
                            </div>
                            <div className="orderFooter">
                                <div className="buttons">
                                    <button className="btnForFormLittle" onClick={this.submitOrder}>商品入庫</button>
                                    <button className="btnForFormLittle" onClick={this.cancelOrder}>取消操作</button>
                                </div>
                            </div>
                        </div>
                        <ItemSelector orderType={currentOrder.type} callback={this.addItemList} shopRef={this.props.shop.shopRef} isShow={this.state.isShowSearchPanel}/>
                    </div>
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
    searchPanelToggle=()=>{
        this.setState(preState=>({
            isShowSearchPanel:!preState.isShowSearchPanel,
        }))
    }
    createNewOrder(){
        return {
            id:`${randomStockOrderID()}`,
            stockInList:[],
            search_purchaseID:[],
            type:'return',
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
                            console.log('移除重複品項');
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
                updateTimes:order.updateTimes,
            });
        }else{
            currentOrder.stockInList[targetIndex].itemList=currentOrder.stockInList[targetIndex].itemList.concat(order.itemList);
        }
        this.setState(preState=>({
            currentOrder,
            localStorageLock:false,
        }))
    }
    deleteItem=(orderIndex,itemIndex)=>{
        if(confirm('確定刪除此筆商品?')){
            let currentOrder=Object.assign({},this.state.currentOrder);
            currentOrder.stockInList[orderIndex].itemList.splice(itemIndex,1);
            if(currentOrder.stockInList[orderIndex].itemList.length===0){
                currentOrder.search_purchaseID.splice(orderIndex,1);
                currentOrder.stockInList.splice(orderIndex,1);
            }
            this.setState(preState=>({
                currentOrder,
                localStorageLock:false,
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
            currentOrder,
        }))
    }
    /**
    新增進貨單到資料庫，同時新增產品庫存到產品collection，最後更新各採購單的狀態
    */
    submitOrder=async()=>{
        let shopRef=this.props.shop.shopRef;
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
                console.log(changedOrder);
            })
            checkAll.push(check);
        }
        await Promise.all(checkAll);
        if(changedOrder.length>0){
            let order=Object.assign({},currentOrder);
            order.stockInList=order.stockInList.filter(stockIn=>{
                console.log(changedOrder);
                return !changedOrder.includes(stockIn.purchaseID)
            })
            console.log(order);
            this.setState(preState=>({
                currentOrder:order,
                localStorageLock:false,
            }))
            console.log(`移除已發生變更的採購單，請重新查詢`);
            return ;
        }
        if(isAllOperateNumKeyIn){
            currentOrder.time=new Date().valueOf();
            console.log(currentOrder);
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
                    localStorageLock:false,
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
                localStorageLock:false,
            }))
        }
    }
}

export default StockReturnOrder;