import React,{ Component,Fragment } from 'react';
import {randomPurchaseOrderID, randomProductID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';
import ContentTable from './common/ContentTable';
import Supplier, {SupplierInfo} from "./common/Supplier";
import FormProductEditing from './common/FormProductEditing';

/**
This Component for creating new purchase order.
Need Props:
shop(all shop come from redux store pass down by shop Compnent)
shopUrl(shop prefix url locaiton)
route props(history, location and params)

為了能快速查詢與修改firebase資料，同時又受限於資料合適在本Component內流動的格式，
firebase的採購單資料格式與在本Component內的不同，需要作轉換。

*/

class OrderCreating extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:'loading', /** waiting get order data from local storage */
            localStorageLock:true,  /** use for auto save to localStorage */
            onProductEditing:false, /** product item adding form */
            onSupplierAdding:false, /** supplier adding form */
            currentProduct:null /** current editing product */
        }
    }
    componentDidMount(){
        let uncompletedNewOrder=JSON.parse(localStorage.getItem('uncompleted-purchase-newOrder'));
        let currentOrder;
        /** 設定current order */
        if(!uncompletedNewOrder){
            currentOrder=this.createNewOrder();
            localStorage.setItem('uncompleted-purchase-newOrder',JSON.stringify(currentOrder));       
        }else{
            currentOrder=uncompletedNewOrder; /** 如果有未完成的Order，則不新增新的Order */
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
                <div>【 ORDER LOADING COMPONENT 】</div>: /** order data loading */
                <div className="shopMainArea shopMainArea-purchase-orderCreating"> {/** current order */}
                    {onSupplierAdding? /* 新增供應商 */
                    <Supplier shopRef={this.props.shop.shopRef} toggle={this.toggleSupplierAddingForm} />:null}
                    {onProductEditing? /* 新增產品表單 */
                    <FormProductEditing currentProduct={this.state.currentProduct} 
                    submitProductSpecs={this.submitProductSpecs} 
                    cancelUpdateProduct={this.cancelUpdateProduct} />:null}
                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>採購單登錄</div>
                            <div>使用者：<span>{`${this.props.shop.user.name}`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/purchase/history`)}}>歷史訂單</button>
                            <button className="btnForFormBig">庫存查詢</button>
                            <button className="btnForFormBig" onClick={()=>{this.toggleSupplierAddingForm(true)}}>新增供應商</button>
                        </div>
                    </div>
                    <div className="informationArea">
                        <div className="basicInfo">
                            <span className="number">{`採購單號 ${currentOrder.id}`}</span>
                            <SupplierInfo title={currentOrder.search_supplier[0]} address={currentOrder.search_supplier[1]} tel={currentOrder.search_supplier[2]}/>
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
                                <span>成本總計</span><span className="sumOfCost">{this.getStaticData().sumOfCost}</span>
                                <span>平均利潤</span><span className="avgProfit">{this.getStaticData().avgProfit}</span>
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
            id:`${randomPurchaseOrderID()}`, /** purchase id */
            products:[], /** products go to be purchase  */
            search_supplier:[], /** for search.. */
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
                itemList:[],
                startAt:1,
            }
        }))
    }
    modifyProduct=(productIndex)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        let currentProduct=currentOrder.products[productIndex];
        this.setState(preState=>({
            onProductEditing:true,
            currentProduct:currentProduct,
         }))
    }
    /** delete product */
    deleteProduct=(productIndex)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        let target=currentOrder.products[productIndex];
        if(confirm(`確定刪除整筆產品:${target.productID}`)){
            currentOrder.products.splice(productIndex,1)
            this.setState(preState=>({
                localStorageLock:false, /** update to local */
                currentOrder,
            }))
        }
    }
    /** submit or canel new product */
    submitProductSpecs=(productSpecs)=>{
        let isNewPorduct=true;
        let productIndex;
        let currentOrder=Object.assign({},this.state.currentOrder);
        for(let key in currentOrder.products){
            if(currentOrder.products[key].productID===productSpecs.productID){
                productIndex=key
                isNewPorduct=false;
            }
        }
        if(isNewPorduct){
            currentOrder.products.push(productSpecs);
        }else{
            currentOrder.products[productIndex]=productSpecs
        }
        this.setState(preState=>({
            currentOrder,
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
        let products=this.state.currentOrder.products;
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
            modifyRecord:[],
            time:new Date().valueOf()
        }
        return orderFRBS;
    }
    /** submitOrder */
    submitOrder=()=>{
        /** Submit created purchase order to database and clear localStorage */
        /** Stay at create and show new empty order form */
        /** Tranform purchase order data structure to which firebase need */
        let currentOrder=this.state.currentOrder;
        if(currentOrder.products.length===0){
            alert('尚未新增任何產品，請先新增產品');
        }else if(currentOrder.search_supplier.length===0){
            alert('尚未填寫供應商，請先填寫供應商');
        }else if(confirm('確定送出採購單？')){
            let orderFRBS=this.transformStructureFRBS(currentOrder);
            this.props.shop.shopRef.collection('purchases').doc(currentOrder.id).set(orderFRBS)
            .then(()=>{
                alert(`採購單: ${orderFRBS.id} 成功新增！`);
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