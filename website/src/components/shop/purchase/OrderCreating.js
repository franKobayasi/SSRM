import React,{ Component,Fragment } from "react";
import {randomPurchaseOrderID, randomProductID, roundAfterPointAt} from "../../../lib";
import {createHashHistory as history} from "history";
/** component */
import SideNav from '../../layout/SideNav';
import FormProductEditing from './FormProductEditing';
/** other resource */
import editImg from "../../../img/editBtn.png";
import deleteImg from "../../../img/deleteBtn.png";

/**
This Component for create hold new order.
Now can't pass history order into this component.
 */
class OrderCreating extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:{
                id:`${randomPurchaseOrderID()}`,
                supplierTitle:'Supplier',
                supplierAddress:'請先完成查詢或新增',
                supplierPhone:'請先完成查詢或新增',
                products:[],
                isNeedUpdate:false
            },
            onProductEditing:false,
            onSupplierAdding:false,
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
    /** show and hide 供應商註冊表單*/
    showSupplierAddingForm=()=>{
        this.setState(preState=>({
            onSupplierAdding:true,
        }))
    }
    hideSupplierAddingForm=()=>{
        this.setState(preState=>({
            onSupplierAdding:false,
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
                isNeedUpdate:true
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
    /** 註冊新供應商 */
    submitNewSupplier=()=>{
        let title=this.state.tempSupplierName?this.state.tempSupplierName.trim():'';
        let address=this.state.tempSupplierAddress?this.state.tempSupplierAddress.trim():'';
        let phone=this.state.tempSupplierPhone?this.state.tempSupplierPhone.trim():'';
        if(title.length===0){
            alert('請輸入供應商名稱');
        }else if(address.length===0){
            alert('請輸入供應商地址');
        }else if(phone.length===0){
            alert('請輸入供應商電話');
        }else{
            (async()=>{
                let result= await this.checkSupplier(phone);
                console.log(result);
                if(result.supplier){
                    alert('供應商已存在，若供應商電話有重複或更改請至店家設定頁面更改');
                    this.setCurrentSuppier(title,address,phone);
                }else{
                    await this.props.shop.shopRef.collection('suppliers')
                        .doc(phone).set({
                            title,
                            address
                        })
                        .then((res)=>{
                            console.log(res);
                            alert('註冊成功！');
                            this.setCurrentSuppier(title,address,phone);
                        })
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
    startModifyProduct=(evnt)=>{
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
        order.isNeedUpdate=true; /** update to local */
        this.setState(preState=>({
            currentOrder:order,
            onProductEditing:false
        }))
    }
    cancelUpdateProduct=()=>{
        this.setState(preState=>({
            onProductEditing:false
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
                        isNeedUpdate:true,
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
            avgProfit:0
        };
        for(let product of products){
            for(let item of product.itemList){
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
        if(confirm('確定送出採購單？')){
            let order=Object.assign({},this.state.currentOrder);
            order.time=new Date();
            this.props.shop.shopRef.collection('purchases').doc(order.id).set(order)
                .then(()=>{
                    alert(`採購單: ${order.id} 成功新增！`);
                    this.setState(preState=>({
                        currentOrder:{
                            id:`${randomPurchaseOrderID()}`,
                            supplierTitle:'Supplier',
                            supplierAddress:'請先完成查詢或新增',
                            supplierPhone:'請先完成查詢或新增',
                            products:[],
                            isNeedUpdate:true
                        },
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
                currentOrder:{
                    id:`${randomPurchaseOrderID()}`,
                    supplierTitle:'Supplier',
                    supplierAddress:'請先完成查詢或新增',
                    supplierPhone:'請先完成查詢或新增',
                    products:[],
                    isNeedUpdate:true
                },
            }))
        }
    }
    componentDidMount(){
        let uncompletedNewOrder=JSON.parse(localStorage.getItem('uncompleted-purchase-newOrder'));
        let currentOrder;
        /** 設定current order */
        /** 如果有未完成的Order，則不新增新的Order */
        if(!uncompletedNewOrder){
            currentOrder=this.state.currentOrder;
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
            this.setState(preState=>({
                currentOrder,
            }))   
        }
    }
    componentDidUpdate(){
        /** auto upadte order to localStorage */
        if(this.state.currentOrder.isNeedUpdate){
            localStorage.setItem('uncompleted-purchase-newOrder',JSON.stringify(this.state.currentOrder))
            this.setState(preState=>({
                currentOrder:{
                    ...preState.currentOrder,
                    isNeedUpdate:false,
                }
            }))
            console.log('update to local');
        }
    }
    render(){
        let onProductEditing=this.state.onProductEditing;
        let onSupplierAdding=this.state.onSupplierAdding;
        let currentOrder=this.state.currentOrder;
        let currentProduct=this.state.currentProduct
        /**
            order={
                id,
                (isNeedUpdate)
                products:[
                    products...
                ],
                supplier: {
                    address,
                    title,
                    phone
                }
            }
         */
        return (
            <Fragment>
                <SideNav />
                <div className="shopMainArea-purchase-orderCreating">
                    {/* 新增供應商 */}
                    {onSupplierAdding?
                    <form className="addNewSupplierForm">
                        <div><label>供應商</label><input id="tempSupplierName" onChange={this.handleChange}/></div>
                        <div><label>地址</label><input id="tempSupplierAddress" onChange={this.handleChange}/></div>
                        <div><label>電話</label><input id="tempSupplierPhone" onChange={this.handleChange} placeholder={"這將作為查詢使用"}/></div>
                        <div className="buttons">
                            <button className="finish" onClick={this.submitNewSupplier}>完成</button>
                            <button className="cancel" onClick={this.hideSupplierAddingForm}>取消</button>
                        </div>
                    </form>:null}
                    {/* 新增產品表單 */}
                    {onProductEditing?
                    <FormProductEditing product={this.state.currentProduct} 
                        submitNewProduct={this.submitNewProduct} 
                        cancelUpdateProduct={this.cancelUpdateProduct}    
                        />:null}
                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>採購管理 \ 採購登入</div>
                            <div>user: <span>{`Frank Lin`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button className="btnForFormBig" onClick={()=>{history().push(`${this.props.shopUrl}/purchase/history`)}}>歷史訂單</button> {/*返回訂單歷史*/}
                            <button className="btnForFormBig">庫存查詢</button>
                            <button className="btnForFormBig">修改訂單</button>
                            <button className="btnForFormBig" onClick={this.showSupplierAddingForm}>新增供應商</button>
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
                        <div className="contentTable">
                            <div className="tableHead">
                                <span className="productID">產品編號</span>
                                <span className="itemID">商品牌號</span>
                                <span className="productName">商品名稱</span>
                                <span className="itemSpec">尺寸</span>
                                <span className="itemSpec">顏色</span>
                                <span className="itemSpec">件數</span>
                                <span className="productCost">進貨單價</span>
                                <span className="sumOfCostPerRow">成本小計</span>
                                <span className="productPrice">商品標價</span>
                                <span className="productProfit">單項利潤</span>
                            </div>
                            {currentOrder.products&&currentOrder.products.map((product,index)=>(
                                <ProductBox key={index} product={product} 
                                startModifyProduct={this.startModifyProduct}
                                deleteProduct={this.deleteProduct}    
                                />
                            ))}
                            <div onClick={this.startProductAdding} className="addNewProduct btn">+</div>
                        </div>
                        <div className="buttons">
                            <button className="btnForFormLittle finish" onClick={this.submitOrder}>完成</button>
                            <button className="btnForFormLittle cancel" onClick={this.cancelOrder}>取消</button>
                        </div>
                        <div className="totalInfo">
                            <span>成本總計</span><span className="sumOfCost">{this.computeCostAndProfit().sumOfCost}</span>
                            <span>平均利潤</span><span className="avgProfit">{this.computeCostAndProfit().avgProfit}</span>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

/**
    product={
        id,
        name,
        cost,
        price,
        startAt,
        itemList:[
            {
                itemID,
                size,
                num,
                color,
                isEdit,
            }
        ]
    }
 */

function ProductBox(props) {
    let product=props.product;
    return (
        <div id={product.id} className="productBox">
            {product.itemList.map((item,index)=>{
                return (
                    <div key={index} className="itemBox">
                        <span className="productID">{product.id}</span>
                        <span className="itemID">{item.itemID}</span>
                        <span className="productName">{product.name}</span>
                        <span className="itemSpec">{item.size}</span>
                        <span className="itemSpec">{item.color}</span>
                        <span className="itemSpec">{item.num}</span>
                        <span className="productCost">{product.cost}</span>
                        <span className="sumOfCostPerRow">{`${item.num*product.cost}`}</span>
                        <span className="productPrice">{product.price}</span>
                        <span className="productProfit">{`${roundAfterPointAt(((product.price-product.cost)/product.price),2)}`}</span>
                    </div>
                )
            })}
            <img className="edit" src={editImg} onClick={props.startModifyProduct}/>
            <img className="delete" src={deleteImg} onClick={props.deleteProduct}/>
        </div> 
    )
}
function Supplier(props){
    return (
        <Fragment>
            <span className="title">供應商：</span>
            <span className="SupplierDetail">{props.title}</span>
            <span className="title">商家電話：</span>
            <span className="SupplierAddress">{props.phone}</span>
            <span className="title">商家地址：</span>
            <span className="SupplierAddress">{props.address}</span>
        </Fragment>
    )
}

export default OrderCreating;