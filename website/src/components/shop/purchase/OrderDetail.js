import React,{ Component,Fragment } from 'react';
import {ssrmDB} from '../../../useFirebase';
import {randomPurchaseOrderID, randomProductID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';
import ContentTable from './common/ContentTable';
import Supplier, {SupplierInfo} from './common/Supplier';
import FormProductEditing from './common/FormProductEditing';

/**
This Component for view and edit history order.
Need to pass history order into this component.

 */
class OrderDetail extends Component{
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
            localStorageLock:true,
        }
    }
    componentDidMount(){
        let currentOrder;
        let shopRef=this.props.shop.shopRef;
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
        console.log('OrderDetail更新')
        /** auto upadte order to localStorage */
        if(!this.state.localStorageLock&&onOrderEditing){
            localStorage.setItem(`History_${this.props.id}`,JSON.stringify(this.state.unsavedHistoryOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
            console.log('update to local');
        }
        if(this.state.currentOrder==='loading'){
            let currentOrder;
            let shopRef=this.props.shop.shopRef;
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
    render(){
        console.log('OrderDetail開始render');
        let onProductEditing=this.state.onProductEditing;
        let onSupplierAdding=this.state.onSupplierAdding;
        let onOrderEditing=this.state.onOrderEditing;
        let orderToRender=onOrderEditing?this.state.unsavedHistoryOrder:this.state.currentOrder;
        let currentProduct=this.state.currentProduct;
        return (
            orderToRender==="loading"?
            <div>data is loading..</div>:
            <div className="shopMainArea shopMainArea-purchase-orderDetail">
                {/* 填寫修改原因訊息 */}
                {this.state.showModifyConfirm?
                <form className="modifyConfirm">
                    <div>修改原因：</div>
                    <textarea id="modifyDescription" onChange={this.handleChange} />
                    <div className="btns"> 
                    <button onClick={this.submitOrder}>送出</button>
                    <button onClick={this.cancelSubmit}>取消</button>
                    </div>
                </form>:null
                }
                {onSupplierAdding? /* 新增供應商 */
                <Supplier shopRef={this.props.shop.shopRef} toggle={this.toggleSupplierAddingForm} />:null}
                {onProductEditing? /* 新增產品表單 */
                <FormProductEditing currentProduct={this.state.currentProduct} 
                    submitProductSpecs={this.submitProductSpecs} 
                    cancelUpdateProduct={this.cancelUpdateProduct} />:null}
                <div className="operatingArea">
                    <div className="currentInfo">
                        <div>採購歷史訂單詳細頁面</div>
                        <div><span>{`使用者：${this.props.shop.user.name}`}</span></div>
                    </div>
                    <div className="operatingBtns">
                        <button className="btnForFormBig" onClick={()=>{
                            this.props.updateOrdersFromDB();
                            history().push(`${this.props.shopUrl}/purchase/history`)}}>歷史訂單</button> {/*返回訂單歷史*/}
                        <button className="btnForFormBig">庫存查詢</button>
                        <button className="btnForFormBig" onClick={()=>{
                            this.toggleSupplierAddingForm(true)
                        }}>新增供應商</button>
                    </div>
                </div>
                <div className="informationArea">
                    <div className="orderHeader">
                        <span className="orderID">{`採購單號：${orderToRender.id}`}</span>
                        <SupplierInfo title={orderToRender.search_supplier[0]} address={orderToRender.search_supplier[1]} tel={orderToRender.search_supplier[2]}/>
                        {
                            onOrderEditing?
                            <div className="orderSetting">
                                <input placeholder="供應商搜尋(電話)" onKeyPress={this.keyInSupplier}/>
                                <span className="title">進貨幣別</span>
                                <select className="moneyType">
                                    <option value="TWD">{`台幣`}</option>
                                    <option value="WON">{`韓元`}</option>
                                    <option value="USD">{`美金`}</option>
                                    <option value="CNY">{`人民幣`}</option>
                                    <option value="JPY">{`日幣`}</option>
                                </select>
                            </div>:null
                        }
                    </div>
                    <ContentTable mode="detail" order={orderToRender}
                        onOrderEditing={onOrderEditing} modifyProduct={this.modifyProduct} 
                        deleteProduct={this.deleteProduct} startProductAdding={this.startProductAdding}/>
                    <div className="orderFooter">
                        <div className="buttons">
                            {
                                onOrderEditing?
                                <Fragment>
                                <button className="btnForFormLittle" onClick={this.showModifyConfirm}>完成</button>
                                <button className="btnForFormLittle" onClick={this.cancelEditOrder}>取消</button>
                                </Fragment>:
                                <button className="btnForFormLittle" onClick={this.editOrder}>編輯</button>
                            }
                        </div>
                        <div className="totalInfo">
                            <span>成本總計</span><span className="sumOfCost">{this.getStaticData().sumOfCost}</span>
                            <span>平均利潤</span><span className="avgProfit">{this.getStaticData().avgProfit}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    transformStructureCMPT=(orderFRBS)=>{
        /** direct copy productID,modifyRecord,search_supplier */
        let currentOrder={
            id:orderFRBS.id,
            modifyRecord:orderFRBS.modifyRecord,
            search_supplier:orderFRBS.search_supplier,
            time:orderFRBS.time,
            products:[],
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
            modifyRecord:orderCMPT.modifyRecord,
            time:orderCMPT.time
        }
        return orderFRBS;
    }
    editOrder=()=>{
        let unsavedHistoryOrder=this.state.unsavedHistoryOrder;
        if(!unsavedHistoryOrder){
            // 如果不存在有未儲存的修改資料，則將訂單資料存入未儲存
            unsavedHistoryOrder=Object.assign({},this.state.currentOrder);
            this.setState((preState)=>({
                localStorageLock:false,
                onOrderEditing:true,
                unsavedHistoryOrder,
            }));
        }else{
            this.setState((preState)=>({
                onOrderEditing:true,
            }));
        }
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
        await this.props.shop.shopRef.collection('suppliers').doc(tel).get()
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
            console.log(error);
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
            currentOrder:{
                ...preState.currentOrder,
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
            console.log(target.value);
            (async()=>{
                let result= await this.checkSupplier(target.value);
                if(result.supplier){
                    let supplier=result.supplier;
                    target.value=''; /** 清空查詢 */
                    console.log(supplier)
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
        if(confirm(`確定刪除整筆產品:${target.productID}`)){
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
    submitOrder=(evnt)=>{
        evnt.preventDefault();
        let description=this.state.modifyDescription;
        if(description.length===0){
            alert('請填寫修改原因');
        }else if(confirm('確定修改？')){
            let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
            unsavedHistoryOrder.modifyRecord.push({
                description:description,
                time:new Date().valueOf(),
                user:this.props.shop.user.name,
            });
            let orderFRBS=this.transformStructureFRBS(unsavedHistoryOrder);
            this.props.shop.shopRef.collection('purchases').doc(orderFRBS.id).set(orderFRBS)
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
            }))
            localStorage.removeItem(`History_${this.props.id}`);
        }
    }
}

export default OrderDetail;