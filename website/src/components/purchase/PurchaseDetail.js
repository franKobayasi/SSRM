import React,{ Component,Fragment } from 'react';
import {ssrmDB} from '../../useFirebase';
import {randomPurchaseOrderID, randomProductID, roundAfterPointAt} from '../../lib';
import {createHashHistory as history} from 'history';
/** component */
import AppSideNav from '../common/AppSideNav';
import {Loading} from '../common/Loading';
import ContentTable from './ContentTable'; 
import ModifySubmit from '../common/ModifySubmit';
import StockChecker from '../common/StockChecker';
import Supplier, {FormSupplierEntry} from '../common/Supplier';
import FormProductEditing from './FormProductEditing';

/**
This Component for view and edit history order.
Need to pass history order into this component.

 */
class PurchaseDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:'loading',
            currentProduct:null,
            unsavedHistoryOrder:null,
            onOrderEditing:false,
            onProductEditing:false,
            onSupplierAdding:false,
            isModified:false,
            showModifyConfirm:false,
            showStockChecker:false,
            localStorageLock:true,
        }
    }
    render(){
        let onProductEditing=this.state.onProductEditing;
        let onSupplierAdding=this.state.onSupplierAdding;
        let onOrderEditing=this.state.onOrderEditing;
        let orderToRender=onOrderEditing?this.state.unsavedHistoryOrder:this.state.currentOrder;
        let currentProduct=this.state.currentProduct;
        return (
            <div className="app-pageMainArea app-purchase-order">
            {
                this.state.showStockChecker?
                <StockChecker toggle={this.showStockChecker}/>:
                null
            }
            {
                this.state.showModifyConfirm?
                <ModifySubmit title="採購單修改" submit={this.submitOrder} cancel={this.cancelSubmit}/>:
                null
            }
                {onSupplierAdding? /* 新增供應商 */
                <FormSupplierEntry shopRef={this.props.shopRef} toggle={this.toggleSupplierAddingForm} />:null}
                {onProductEditing? /* 新增產品表單 */
                <FormProductEditing currentProduct={this.state.currentProduct} 
                    submitProductSpecs={this.submitProductSpecs} 
                    cancelUpdateProduct={this.cancelUpdateProduct} />:null}
                <div className="app-pageMainArea-header">
                    <div className="location">
                        <div>當前位置：採購歷史訂單詳細頁面</div>
                    </div>
                    <div className="operatingBtns">
                        <button className="fx-btn--mainColor" onClick={()=>{
                            this.props.getOrdersFromDB();
                            history().push(`/purchase/history`)}}>歷史訂單</button>
                        <button className="fx-btn--mainColor" onClick={()=>{
                            this.showStockChecker(true);
                        }}>庫存查詢</button>
                        <button className="fx-btn--mainColor" onClick={()=>{
                            this.toggleSupplierAddingForm(true)
                        }}>新增供應商</button>
                    </div>
                </div>
                <div className="app-pageMainArea-main orderContent">
                {
                    orderToRender==="loading"?
                    <Loading text="訂單載入中"/>:
                    <Fragment>
                        <div className="orderContent-header">
                            <span className="orderID">
                                <label>採購單號</label>
                                <span>{orderToRender.id}</span>
                            </span>
                            <span className="orderContent-supplier-search">
                            {
                                onOrderEditing?
                                <input placeholder="供應商搜尋(電話)" onKeyPress={this.keyInSupplier}/>:null
                            }
                                <Supplier supplier={orderToRender.search_supplier}/>
                            </span>
                            {
                                onOrderEditing?
                                <span className="orderContent-moneyType-select">                            
                                    <label className="title">進貨幣別</label>
                                    <select>
                                        <option value="TWD">{`台幣`}</option>
                                        <option value="WON">{`韓元`}</option>
                                        <option value="USD">{`美金`}</option>
                                        <option value="CNY">{`人民幣`}</option>
                                        <option value="JPY">{`日幣`}</option>
                                    </select>
                                </span>:null
                            }
                        </div>
                        <ContentTable mode="detail" order={orderToRender}
                            onOrderEditing={onOrderEditing} modifyProduct={this.modifyProduct} 
                            deleteProduct={this.deleteProduct} startProductAdding={this.startProductAdding}/>
                        <div className="orderContent-footer">
                            <div className="actionBtns">
                                {
                                    onOrderEditing?
                                    <Fragment>
                                    <button className="fx-btn--25LH-mainColor" onClick={this.showModifyConfirm}>完成</button>
                                    <button className="fx-btn--25LH-mainColor" onClick={this.cancelEditOrder}>取消</button>
                                    </Fragment>:
                                    <button className="fx-btn--25LH-mainColor" onClick={this.editOrder}>編輯</button>
                                }
                            </div>
                            <div className="staticInfo">
                                <span>成本總計</span><span className="sumOfCost">{this.getStaticData().sumOfCost}</span>
                                <span>平均利潤</span><span className="avgProfit">{this.getStaticData().avgProfit}</span>
                            </div>
                        </div>
                    </Fragment>
                }
                </div>
            </div>
        )
    }
    componentDidMount(){
        let currentOrder;
        let shopRef=this.props.shopRef;
        shopRef.collection('purchases').doc(this.props.id).get()
        .then(doc=>{
            if(doc.exists){
                currentOrder=this.transformStructureCMPT(doc.data());
                this.setState(preState=>({
                    currentOrder,
                }))
            }
        })
    }
    componentDidUpdate(){
        let onOrderEditing=this.state.onOrderEditing;
        /** auto upadte order to localStorage */
        if(!this.state.localStorageLock&&onOrderEditing){
            localStorage.setItem(`History_${this.props.id}`,JSON.stringify(this.state.unsavedHistoryOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
        }
        if(this.state.currentOrder==='loading'){
            let currentOrder;
            let shopRef=this.props.shopRef;
            shopRef.collection('purchases').doc(this.props.id).get()
            .then(doc=>{
                if(doc.exists){
                    currentOrder=this.transformStructureCMPT(doc.data());
                    this.setState(preState=>({
                        currentOrder,
                    }))
                }
            })
        }
    }
    transformStructureCMPT=(orderFRBS)=>{
        /** direct copy productID,modifyRecord,search_supplier */
        let currentOrder={
            id:orderFRBS.id,
            modifyRecord:orderFRBS.modifyRecord,
            search_supplier:orderFRBS.search_supplier,
            time:orderFRBS.time,
            products:[],
            updateTimes:orderFRBS.updateTimes
        }
        let itemList=orderFRBS.itemList
        /** 1. 先分組，將產品編號相同的商品分配到同組 */
        let group={};
        for(let i=0;i<itemList.length;i++){
           if(!group[itemList[i].productID]){
               group[itemList[i].productID]=[];
           }
            group[itemList[i].productID].push(itemList[i]);
        }
        /** 2. 開始組裝 */
        for(let key in group){
            let product={
                productID:group[key][0].productID,
                name:group[key][0].name,
                price:group[key][0].price,
                cost:group[key][0].cost,
                startAt:orderFRBS.startAt[key],
                itemList:[],
            };
            for(let item of group[key]){
                let obj={
                   itemID:item.itemID,
                   size:item.size,
                   color:item.color,
                   num:item.num,
                   inStock:item.inStock,
                   status:item.status,
                }
                product.itemList.push(obj);
            }
            currentOrder.products.push(product);
        }
        return currentOrder;
    }
    transformStructureFRBS=(orderCMPT)=>{
        let startAt={};
        let itemList=[];
        let search_productNameAndID=[];
        for(let product of orderCMPT.products){
            /** 1. 將每個產品的ID累計數計至order */
            startAt[product.productID]=product.startAt;
            /** 2. 將每個產品ID與名稱記錄至搜尋陣列 */
            search_productNameAndID.push(`${product.productID}`); 
            search_productNameAndID.push(`${product.name}`);
            /** 3. 將products拆分為單獨的items */
            for(let item of product.itemList){
                let obj=Object.assign({},item,{
                    productID:product.productID,
                    name:product.name,
                    price:product.price,
                    cost:product.cost,
                })
                itemList.push(obj);
            }
        }
        let orderFRBS={
            id:orderCMPT.id,
            startAt:startAt, // for firebase structure need 
            itemList:itemList, // for firebase structure need 
            search_productNameAndID:search_productNameAndID, // for firebase structure need 
            search_supplier:orderCMPT.search_supplier,
            static:this.getStaticData(),
            modifyRecords:orderCMPT.modifyRecords,
            updateTimes:orderCMPT.updateTimes,
            time:orderCMPT.time
        }
        return orderFRBS;
    }
    showStockChecker=(bool)=>{
        this.setState(preState=>({
            showStockChecker:bool
        }));
    }
    editOrder=()=>{
        let unsavedHistoryOrder=JSON.parse(localStorage.getItem(`History_${this.props.id}`));
        let localStorageLock=true;
        if(!unsavedHistoryOrder){
            // 如果不存在有未儲存的修改資料，則將訂單資料存入未儲存
            unsavedHistoryOrder=Object.assign({},this.state.currentOrder);
            localStorageLock=false;
        }
        this.setState((preState)=>({
            localStorageLock,
            onOrderEditing:true,
            unsavedHistoryOrder,
        }));
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
    /** Supplier */
    /** 確認此供應商是否註冊過 */
    checkSupplier=async(tel)=>{
        let result={};
        await this.props.shopRef.collection('suppliers').doc(tel).get()
        .then(doc=>{
            if(!doc.exists){
                result.message='查無供應商資料，請先新增'
                return ;
            }else{
                result.supplier={
                    title:doc.data().title,
                    address:doc.data().address,
                    tel:doc.id
                }
                return ; 
            }
        })
        .catch(error=>{
            result.message='ERROR\n查詢確認供應商資料失敗'
            console.error(`${result.message}`);
            return ;
        })
        return result;
    }
    /** show and hide 供應商註冊表單*/
    toggleSupplierAddingForm=(bool)=>{
        this.setState(preState=>({
            onSupplierAdding:bool,
        }))
    }
    /** 設定當前供應商 */
    setCurrentSuppier=(title,address,tel)=>{
        this.setState(preState=>({
            unsavedHistoryOrder:{
                ...preState.unsavedHistoryOrder,
                search_supplier:[`${title}`,`${address}`,`${tel}`]
            },
            localStorageLock:false,
        }))
    }
    /** 輸入供應商 */   
    keyInSupplier=(evnt)=>{
        let target=evnt.target;
        let keyCode=evnt.charCode;
        if(keyCode===13){
            (async()=>{
                let result= await this.checkSupplier(target.value);
                if(result.supplier){
                    let supplier=result.supplier;
                    target.value=''; /** 清空查詢 */
                    this.setCurrentSuppier(supplier.title,supplier.address,supplier.tel)
                }else{
                    alert(`${result.message}`)
                }
            })();
        }
    }
    /** Product */
    /** show 產品添加表單 */
    startProductAdding=()=>{
        this.setState(preState=>({
            onProductEditing:true,
            currentProduct:{
                productID:`${randomProductID()}`,
                name:'',
                cost:'',
                price:'',
                startAt:1,
                itemList:[],
            }
        }))
    }
    modifyProduct=(productIndex)=>{
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        let currentProduct=unsavedHistoryOrder.products[productIndex];
        this.setState(preState=>({
            onProductEditing:true,
            currentProduct,
         }))
    }
    /** delete product */
    deleteProduct=(productIndex)=>{
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        let target=unsavedHistoryOrder.products[productIndex];
        let isAlreadyStock=false;
        if(confirm(`確定刪除整筆產品:${target.productID}`)){
            search:
            for(let item of target.itemList){
                if(item.inStock>0){
                    isAlreadyStock=true;
                }
                break search;
            }
            if(isAlreadyStock){
                alert('此商品已經進行入庫作業無法刪除！')
                return;
            }
            unsavedHistoryOrder.products.splice(productIndex,1)
            this.setState(preState=>({
                localStorageLock:false, /** update to local */
                unsavedHistoryOrder,
            }))
        }
    }
    /** submit or canel new product */
    submitProductSpecs=(productSpecs)=>{
        let isNewPorduct=true;
        let productIndex;
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        for(let key in unsavedHistoryOrder.products){
            if(unsavedHistoryOrder.products[key].productID===productSpecs.productID){
                productIndex=key
                isNewPorduct=false;
            }
        }
        if(isNewPorduct){
            unsavedHistoryOrder.products.push(productSpecs);
        }else{
            unsavedHistoryOrder.products[productIndex]=productSpecs
        }
        this.setState(preState=>({
            unsavedHistoryOrder,
            onProductEditing:false,
            currentProduct:null,
            localStorageLock:false, /** update to local */
        }))
    }
    cancelUpdateProduct=()=>{
        this.setState(preState=>({
            onProductEditing:false,
            currentProduct:null,
        }))
    }
    /** compute sum of cost and avanrage profit */
    getStaticData=()=>{
        let products;
        if(this.state.onOrderEditing){
            products=this.state.unsavedHistoryOrder.products;
        }else{
            products=this.state.currentOrder.products;
        }
        let result={
            sumOfCost:0,
            sumOfPrice:0,
            avgProfit:0,
            sumOfNum:0,
        };
        for(let product of products){
            for(let item of product.itemList){
                result.sumOfNum+=Number(item.num);
                result.sumOfCost+=(product.cost*item.num);
                result.sumOfPrice+=(product.price*item.num);
            }
        }
        let avgProfit=(result.sumOfPrice-result.sumOfCost)/result.sumOfPrice;
        result.avgProfit=avgProfit?roundAfterPointAt(avgProfit,2):"..."
        return result; 
    }
    /** submitOrder */
    showModifyConfirm=()=>{
        this.setState(preState=>({
            showModifyConfirm:true,
            modifyDescription:'',
        }))
    }
    submitOrder=(operator,reason)=>{
        if(reason.length<5){
            alert('修改原因未填寫或長度過短，請確認');
        }else if(operator.length<1){
            alert('操作人員未填寫或長度過短，請確認');
        }else if(confirm('確定修改？')){
            let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
            if(!unsavedHistoryOrder.modifyRecords)
                unsavedHistoryOrder.modifyRecords=[];
            unsavedHistoryOrder.modifyRecords.push({
                reason,
                operator,
                time:new Date().valueOf(),
            });
            let orderFRBS=this.transformStructureFRBS(unsavedHistoryOrder);
            this.props.shopRef.collection('purchases').doc(orderFRBS.id).set(orderFRBS)
            .then(()=>{
                alert(`採購單: ${orderFRBS.id} 更新成功！`);
                this.setState(preState=>({
                    currentOrder:'loading',
                    showModifyConfirm:false,
                    onOrderEditing:false,
                    unsavedHistoryOrder:null,
                }))
                localStorage.removeItem(`History_${this.props.id}`);
                return ;
            })
            .catch(error=>{
                console.error('Error\n 送出採購單時發生錯誤，無法更新至資料庫');
                console.log(error);
                return ;
            })
        }
    }
    cancelSubmit=()=>{
        this.setState(preState=>({
            showModifyConfirm:false,
        }))
    }
    /** cancel order */
    cancelEditOrder=()=>{
        if(confirm('有尚未儲存的修改內容，確定取消修改？')){
            this.setState(preState=>({
                onOrderEditing:false,
                unsavedHistoryOrder:null,
                currentOrder:'loading'
            }))
            localStorage.removeItem(`History_${this.props.id}`);
        }
    }
}

export default PurchaseDetail;