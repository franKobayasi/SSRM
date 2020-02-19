import React,{ Component,Fragment } from 'react';
import {randomPurchaseOrderID, randomProductID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';
import Supplier from './common/Suppiler';
import ContentTable from './common/ContentTable';
import SupplierAddingForm from "./common/SupplierAddingForm";
import FormProductEditing from './common/FormProductEditing';

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class OrderCreating extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:'loading',
            localStorageLock:true,
            onProductEditing:false,
            onSupplierAdding:false,
        }
    }
    componentDidMount(){
        let uncompletedNewOrder=JSON.parse(localStorage.getItem('uncompleted-purchase-newOrder'));
        let currentOrder;
        /** 設定current order */
        /** 如果有未完成的Order，則不新增新的Order */
        if(!uncompletedNewOrder){
            currentOrder=this.createNewOrder();
            localStorage.setItem('uncompleted-purchase-newOrder',JSON.stringify(currentOrder));       
        }else{
            currentOrder=uncompletedNewOrder;
            /** 確認是否有空產品(該產品內的itemList為空陣列)*/
            for(let product of currentOrder.products){
                if(product.itemList.length===0){
                    let index=currentOrder.products.indexOf(product);
                    currentOrder.products.splice(index,1);
                    localStorage.setItem('uncompleted-purchase-newOrder',JSON.stringify(currentOrder)); 
                }
            }
        }
        this.setState(preState=>({
            currentOrder,
        }))   
    }
    componentDidUpdate(){
        /** auto upadte order to localStorage */
        if(!this.state.localStorageLock){
            localStorage.setItem('uncompleted-purchase-newOrder',JSON.stringify(this.state.currentOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
            console.log('update to local');
        }
    }
    render(){
        let onProductEditing=this.state.onProductEditing;
        let onSupplierAdding=this.state.onSupplierAdding;
        let currentOrder=this.state.currentOrder;
        let currentProduct=this.state.currentProduct;
        
        return (
            <Fragment>
                <SideNav />
                {
                currentOrder==='loading'?
                <div>Order Loading</div>:
                <div className="shopMainArea shopMainArea-purchase-orderCreating">
                    { /* 新增供應商 */
                        onSupplierAdding?
                        <SupplierAddingForm shopRef={this.props.shop.shopRef} toggle={this.toggleSupplierAddingForm} />:null}

                    {   /* 新增產品表單 */
                        onProductEditing?
                        <FormProductEditing product={this.state.currentProduct} 
                        submitNewProduct={this.submitNewProduct} 
                        cancelUpdateProduct={this.cancelUpdateProduct} />:null}

                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>採購單登錄</div>
                            <div>使用者：<span>{`${this.props.shop.user.name}`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/purchase/history`)}}>歷史訂單</button> {/*返回訂單歷史*/}
                            <button className="btnForFormBig">庫存查詢</button>
                            <button className="btnForFormBig" onClick={()=>{
                                this.toggleSupplierAddingForm(true)
                            }}>新增供應商</button>
                        </div>
                    </div>
                    <div className="informationArea">
                        <div className="basicInfo">
                            <span className="number">{`採購單號 ${currentOrder.id}`}</span>
                            <Supplier title={currentOrder.supplierTitle} address={currentOrder.supplierAddress} phone={currentOrder.supplierPhone}/>
                        </div>
                        <div className="innerOperatingArea">
                            <input placeholder="供應商搜尋(電話)" onKeyPress={this.keyInSupplier}/>
                            <span className="title">進貨幣別</span>
                            <select className="moneyType">
                                <option value="TWD">{`台幣`}</option>
                                <option value="WON">{`韓元`}</option>
                                <option value="USD">{`美金`}</option>
                                <option value="CNY">{`人民幣`}</option>
                                <option value="JPY">{`日幣`}</option>
                            </select>
                        </div>
                        <ContentTable mode="create" order={currentOrder} modifyProduct={this.modifyProduct} 
                        deleteProduct={this.deleteProduct} startProductAdding={this.startProductAdding}/>
                        <footer>
                            <div className="buttons">
                                <button className="btnForFormLittle finish" onClick={this.submitOrder}>完成</button>
                                <button className="btnForFormLittle cancel" onClick={this.cancelOrder}>取消</button>
                            </div>
                            <div className="totalInfo">
                                <span>成本總計</span><span className="sumOfCost">{this.computeCostAndProfit().sumOfCost}</span>
                                <span>平均利潤</span><span className="avgProfit">{this.computeCostAndProfit().avgProfit}</span>
                            </div>
                        </footer>
                    </div>
                </div>
                }
            </Fragment>
        )
    }
    createNewOrder(){
        return {
            id:`${randomPurchaseOrderID()}`,
            supplierTitle:'Supplier',
            supplierAddress:'請先完成查詢或新增',
            supplierPhone:'請先完成查詢或新增',
            products:[],
        };
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
    /** show and hide 供應商註冊表單*/
    toggleSupplierAddingForm=(bool)=>{
        this.setState(preState=>({
            onSupplierAdding:bool,
        }))
    }
    /** 確認此供應商是否註冊過 */
    checkSupplier=async(phone)=>{
        let result={};
        await this.props.shop.shopRef.collection('suppliers')
        .doc(phone).get()
        .then(doc=>{
            if(!doc.exists){
                result.message='查無供應商資料，請先新增'
                return ;
            }else{
                result.supplier={
                    title:doc.data().title,
                    address:doc.data().address,
                    phone:doc.id
                }
                return ; 
            }
        })
        .catch(error=>{
            console.error('ERROR\n查詢確認供應商資料失敗');
            console.log(error);
            return ;
        })
        return result;
    }
    /** 設定當前供應商 */
    setCurrentSuppier=(title,address,phone)=>{
        this.setState(preState=>({
            tempSupplierName:'',
            tempSupplierAddress:'',
            tempSupplierPhone:'',
            onSupplierAdding:false,
            currentOrder:{
                ...preState.currentOrder,
                supplierTitle:title,
                supplierAddress:address,
                supplierPhone:phone,
            }
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
                    this.setCurrentSuppier(supplier.title,supplier.address,supplier.phone)
                }else{
                    alert(`${result.message}`)
                }
            })();
        }
    }
    /** Product */
    /** show 產品添加表單 */
    startProductAdding=()=>{
        if(!this.state.currentProduct){
            this.setState(preState=>({
                onProductEditing:true,
                currentProduct:{
                    id:`${randomProductID()}`,
                    name:'',
                    cost:'',
                    price:'',
                    startAt:1,
                    itemList:[],
                }
            }))
        }else{
            this.setState(preState=>({
                onProductEditing:true,
            }))
        }
    }
    modifyProduct=(evnt)=>{
        let targetProduct=this.state.currentOrder.products.filter(product=>{
            return product.id===evnt.target.parentNode.id;
        })[0]
        if(targetProduct&&typeof targetProduct==="object"){
            this.setState(preState=>({
            onProductEditing:true,
            currentProduct:targetProduct,
         }))
        }else{
            console.error('Error\n edit particular exist order fail');
        }
    }
    /** submit or canel new product */
    submitNewProduct=(newProduct)=>{
        console.log(newProduct);
        let order=Object.assign({},this.state.currentOrder) //複製 currentOrder
        let isOldProUpdate=false;
        /** modify old product */
        for(let product of order.products){
            if(product.id===newProduct.id){
                product=newProduct; // update old product
                isOldProUpdate=true;
            }
        }
        /** new product comming in */
        if(!isOldProUpdate){
            order.products.push(newProduct);
        }
        this.setState(preState=>({
            currentOrder:order,
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
    /** delete product */
    deleteProduct=(evnt)=>{
        let order=Object.assign({},this.state.currentOrder);
        let targetProduct=order.products.filter(product=>{
            return product.id===evnt.target.parentNode.id;
        })[0];
        if(targetProduct&&typeof targetProduct==="object"){
            if(confirm(`確定刪除整筆產品:${targetProduct.id}`)){
                let index=order.products.indexOf(targetProduct);
                if(index>=0){
                    order.products.splice(index,1);
                    this.setState(preState=>({
                        localStorageLock:false, /** update to local */
                        currentOrder:order,
                    }))
                }else{
                    console.error('ERROR\n找不到要刪除的產品')
                }
            }
        }else{
            console.error('Error\n delete particular exist product fail');
        }
    }
    /** compute sum of cost and avanrage profit */
    computeCostAndProfit=()=>{
        let products=this.state.currentOrder.products;
        let result={
            sumOfCost:0,
            sumOfPrice:0,
            avgProfit:0,
            sumOfNum:0,
        };
        for(let product of products){
            for(let item of product.itemList){
                result.sumOfNum+=parseInt(item.num);
                result.sumOfCost+=(product.cost*item.num);
                result.sumOfPrice+=(product.price*item.num);
            }
        }
        let avgProfit=(result.sumOfPrice-result.sumOfCost)/result.sumOfPrice;
        result.avgProfit=avgProfit?roundAfterPointAt(avgProfit,2):"..."
        return result;
    }
    /** submitOrder */
    submitOrder=()=>{
        /** Submit created purchase order to database and clear localStorage */
        /** Stay at create and show new empty order form */
        let currentOrder=this.state.currentOrder
        if(currentOrder.products.length===0){
            alert('尚未新增任何產品，請先新增產品');
        }else if(currentOrder.supplierPhone==="請先完成查詢或新增"){
            alert('尚未填寫供應商，請先填寫供應商');
        }else if(confirm('確定送出採購單？')){
            let order=Object.assign({},currentOrder);
            let result=this.computeCostAndProfit();
            order.avgProfit=result.avgProfit;
            order.sumOfCost=result.sumOfCost;
            order.sumOfNum=result.sumOfNum;
            order.time=new Date();
            this.props.shop.shopRef.collection('purchases').doc(order.id).set(order)
                .then(()=>{
                    alert(`採購單: ${order.id} 成功新增！`);
                    this.setState(preState=>({
                        currentOrder:this.createNewOrder(),
                        localStorageLock:false,
                    }))
                    return ;
                })
                .catch(error=>{
                    console.error('Error\n 送出採購單時發生錯誤，無法更新至資料庫');
                    console.log(error);
                    return ;
                })
            }
    }
    /** cancel order */
    cancelOrder=()=>{
        if(confirm('確定取消新增此訂單？')){
            this.setState(preState=>({
                currentOrder:this.createNewOrder(),
                localStorageLock:false,
            }))
        }
    }
}

export default OrderCreating;