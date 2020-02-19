import React,{ Component,Fragment } from 'react';
import {ssrmDB} from '../../../useFirebase';
import {randomPurchaseOrderID, randomProductID, roundAfterPointAt} from '../../../lib';
import {createHashHistory as history} from 'history';
/** component */
import SideNav from '../../layout/SideNav';
import Supplier from './common/Suppiler';
import ContentTable from './common/ContentTable';
import SupplierAddingForm from './common/SupplierAddingForm';
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
            unsavedHistoryOrder:'loading',
            onOrderEditing:false,
            onProductEditing:false,
            onSupplierAdding:false,
            isModified:false,
            showModifyConfirm:false,
            localStorageLock:true,
        }
    }
    componentDidMount(){
        //尋找是否有此訂單的 unsavedHistoryOrder 並儲存到 state
            //預備動作
        //至資料庫查找此訂單的資料並更新到currentOrder;
            //目的是render提供查看
        let currentOrder,unsavedHistoryOrder;
        let shopRef=this.props.shop.shopRef;
        let search=localStorage.getItem(`History_${this.props.id}`);
        unsavedHistoryOrder=search?JSON.parse(search):'unfound';
        shopRef.collection('purchases').doc(this.props.id).get()
            .then(doc=>{
                if(doc.exists){
                    currentOrder=doc.data();
                    this.setState(preState=>({
                        currentOrder,
                        unsavedHistoryOrder
                    }))
                }
            })
    }
    componentDidUpdate(){
        console.log('OrderDetail更新')
        /** auto upadte order to localStorage */
        if(!this.state.localStorageLock){
            localStorage.setItem(`History_${this.props.id}`,JSON.stringify(this.state.unsavedHistoryOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
            console.log('update to local');
        }
        if(this.state.currentOrder==='loading'){
            let currentOrder,unsavedHistoryOrder;
            let shopRef=this.props.shop.shopRef;
            let search=localStorage.getItem(`History_${this.props.id}`);
            unsavedHistoryOrder=search?JSON.parse(search):'unfound';
            shopRef.collection('purchases').doc(this.props.id).get()
                .then(doc=>{
                    if(doc.exists){
                        currentOrder=doc.data();
                        this.setState(preState=>({
                            currentOrder,
                            unsavedHistoryOrder
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
                { /* 新增供應商 */
                    onSupplierAdding?
                    <SupplierAddingForm shopRef={this.props.shop.shopRef} toggle={this.toggleSupplierAddingForm} />:null}
                {/* 新增產品表單 */}
                {onProductEditing?
                <FormProductEditing product={this.state.currentProduct} 
                    submitNewProduct={this.submitNewProduct} 
                    cancelUpdateProduct={this.cancelUpdateProduct}    
                    />:null}
                <div className="operatingArea">
                    <div className="currentInfo">
                        <div>採購歷史訂單詳細頁面</div>
                        <div>使用者：<span>{`${this.props.shop.user.name}`}</span></div>
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
                    <div className="basicInfo">
                        <span className="number">{`採購單號 ${orderToRender.id}`}</span>
                        <Supplier title={orderToRender.supplierTitle} address={orderToRender.supplierAddress} phone={orderToRender.supplierPhone}/>
                    </div>
                    {
                        onOrderEditing?
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
                        </div>:null
                    }
                    <ContentTable mode="detail" order={orderToRender}
                        onOrderEditing={onOrderEditing} modifyProduct={this.modifyProduct} 
                        deleteProduct={this.deleteProduct} startProductAdding={this.startProductAdding}/>
                    <footer>
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
                            <span>成本總計</span><span className="sumOfCost">{this.computeCostAndProfit().sumOfCost}</span>
                            <span>平均利潤</span><span className="avgProfit">{this.computeCostAndProfit().avgProfit}</span>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
    editOrder=()=>{
        let unsavedHistoryOrder=this.state.unsavedHistoryOrder;
        if(unsavedHistoryOrder==='unfound'){
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
            localStorageLock:false,
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
    /** show 產品添加表單 */
    startProductAdding=()=>{
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
    }
    modifyProduct=(evnt)=>{
        let targetProduct=this.state.currentOrder.products.filter(product=>{
            return product.id===evnt.target.parentNode.id;
        })
        if(targetProduct&&typeof targetProduct==="object"){
            this.setState(preState=>({
            onProductEditing:true,
            currentProduct:targetProduct[0],
         }))
        }else{
            console.error('Error\n edit particular exist order fail');
        }
    }
    /** submit or canel new product */
    submitNewProduct=(newProduct)=>{
        console.log(newProduct);
        let order=Object.assign({},this.state.unsavedHistoryOrder) //複製 currentOrder
        let isOldProUpdate=false;
        /** modify old product */
        order.products.map((product,index)=>{
            if(product.id===newProduct.id){
                order.products[index]=newProduct;
                isOldProUpdate=true;
            }
            return ;
        })
        /** new product comming in */
        if(!isOldProUpdate){
            order.products.push(newProduct);
        }
        this.setState(preState=>({
            unsavedHistoryOrder:order,
            onProductEditing:false,
            localStorageLock:false, /** update to local */
        }))
    }
    cancelUpdateProduct=()=>{
        this.setState(preState=>({
            onProductEditing:false
        }))
    }
    /** delete product */
    deleteProduct=(evnt)=>{
        let order=Object.assign({},this.state.unsavedHistoryOrder);
        let targetProduct=order.products.filter(product=>{
            return product.id===evnt.target.parentNode.id;
        })[0];
        if(targetProduct&&typeof targetProduct==="object"){
            if(confirm(`確定刪除整筆產品:${targetProduct.id}`)){
                let index=order.products.indexOf(targetProduct);
                if(index>=0){
                    order.products.splice(index,1);
                    this.setState(preState=>({
                        unsavedHistoryOrder:order,
                        localStorageLock:false,
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
    showModifyConfirm=()=>{
        /** Submit created purchase order to database and clear localStorage */
        /** Stay at create and show new empty order form */
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
            let order=Object.assign({},this.state.unsavedHistoryOrder);
            let result=this.computeCostAndProfit();
            order.avgProfit=result.avgProfit;
            order.sumOfCost=result.sumOfCost;
            order.sumOfNum=result.sumOfNum;
            if(!order.modify){
                order.modify=[];
            }
            order.modify.push({
                    description:description,
                    time:new Date(),
                    user:this.props.shop.user.name,
                });
            this.props.shop.shopRef.collection('purchases').doc(order.id).set(order)
                .then(()=>{
                    alert(`採購單: ${order.id} 修改成功！`);
                    this.setState(preState=>({
                        currentOrder:'loading',
                        unsavedHistoryOrder:'loading',
                        showModifyConfirm:false,
                        onOrderEditing:false,
                    }))
                    localStorage.removeItem(`History_${this.props.id}`)
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
            }))
        }
    }
}

export default OrderDetail;