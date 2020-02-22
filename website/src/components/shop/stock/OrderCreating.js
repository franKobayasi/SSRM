import React,{ Component,Fragment } from 'react';
import {randomStockOrderID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';
import ItemSelector from './ItemSelector'
/** resource */
import deleteBtn from '../../../img/deleteBtn.png';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class OrderCreating extends Component{
    constructor(props){
        super(props);
        
        this.state={
            isShowSearchPanel:false,
            currentOrder:'loading',
            localStorageLock:true,
            reEditOrder:null, /** re edit itemList of particular purchase order which is going to in stock */
        }
    }
    componentDidMount(){
       let uncompletedNewOrder=JSON.parse(localStorage.getItem('uncompleted-stock-newOrder'));
        let currentOrder;
        /** 設定current order */
        /** 如果有未完成的Order，則不新增新的Order */
        if(!uncompletedNewOrder){
            currentOrder=this.createNewOrder();
            localStorage.setItem('uncompleted-stock-newOrder',JSON.stringify(currentOrder));       
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
            localStorage.setItem('uncompleted-stock-newOrder',JSON.stringify(this.state.currentOrder))
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
                            <div>進貨單登錄</div>
                            <div>使用者：<span>{`${this.props.shop.user.name}`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/stock/history`)}}>歷史進貨單</button>
                            <button className="btnForFormBig">庫存查詢</button>
                        </div>
                    </div>
                    <div className="informationArea">
                        <div className="stockProcessArea">
                            <div className="basicInfoArea">
                                <span className="orderID">{`進貨單號：${currentOrder.id}`}</span>
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
                                        <span className="note">{`採購單號：${order.purchaseID}`}</span>
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
                                                <input defaultValue={item.num-item.inStock}></input>
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
                            <div className="operatingBtns">
                                <button>商品入庫</button>
                                <button>取消操作</button>
                            </div>
                        </div>
                        <ItemSelector reEditOrder={this.state.reEditOrder} callback={this.addItemList} shopRef={this.props.shop.shopRef} isShow={this.state.isShowSearchPanel}/>
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
        };
         /**
        Current Stock Order {
            id:
            以採購單為單位的進貨明細
            stockInList:[
                purchaseID:
                itemList:[]
                // 有此產品往上加
                // 無此產品寫入增加數量
                // 再以結果更新 purchase
            ]
        }
     */
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
            currentOrder.stockInList.push({
                purchaseID:order.purchaseID,
                itemList:order.itemList
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
                currentOrder.stockInList.splice(orderIndex,1);
            }
            this.setState(preState=>({
                currentOrder,
                localStorageLock:false,
            }))
        }
    }
    /**
    新增進貨單到資料庫，同時新增產品庫存到產品collection，最後更新各採購單的狀態
    */
    submitOrder=()=>{
        let shopRef=this.props.shop.shopRef;
        let currentOrder=this.state.currentOrder;
        /** 新增進貨單到資料庫 */
        shopRef.collection('stocks').doc(currentOrder.id).set(currentOrder)
        .then(res=>{
            console.log(`進貨單登錄成功：\n${res}`)
            let itemsUploadPromise=[]; /** 新增各產品 */
            let purchaseUpdatePromise=[]; /** 更新各採購單的狀態 */
            for(let stockIn of currentOrder.stockInList){
                // shopRef.collection(purchases).doc(stockIn.purchaseID).
                /**
                編寫中....
                
                
                 */
            }
        })
    }
}

export default OrderCreating;