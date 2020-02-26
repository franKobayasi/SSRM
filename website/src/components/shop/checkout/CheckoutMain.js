import React,{ Fragment,Component } from "react";
import {connect} from "react-redux";
import {randomCheckOutOrderID, roundAfterPointAt} from '../../../lib';
import {CustomerForm, CustomerDetail} from '../common/Customer';
/** component */

/**
實現結帳功能：



 */

class CheckoutMain extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:null,
            localStorageLock:true,
            isShowCustomerForm:false,
        }
    }
    render(){
        let isShowCustomerForm=this.state.isShowCustomerForm;
        let currentOrder=this.state.currentOrder;
        if(!currentOrder){
            return <div>loading</div>
        }
        return (
        <div className="shopMainArea pageShopCheckOut">
            {
                isShowCustomerForm?
                <CustomerForm shopRef={this.props.shop.shopRef} callback={this.toogleShowCustomerForm} />:null
            }
            <div className="operatingArea">
                <div className="currentInfo">
                    <div>結帳台</div>
                    <div><span>{`使用者：${this.props.shop.user.name}`}</span></div>
                </div>
                <div className="operatingBtns">
                    <button onClick={()=>{this.toogleShowCustomerForm(true)}}>新增會員</button>
                    <button>未結暫存</button>
                    <button>庫存查詢</button>
                    <button>結帳歷史</button>
                </div>
            </div>
            {
                currentOrder?
                <div className="informationArea">
                    <div className="main">
                        <div className="header">
                            <CustomerDetail shopRef={this.props.shop.shopRef} customer={currentOrder.customer}/>
                            <div className="keyInArea">
                                <span className="customer">
                                    <input id="searchCustomerTel" onKeyPress={this.keyInCustomer} placeholder="會員查詢(TEL)" type="text"/>
                                </span>
                                <span className="product"><input onKeyPress={this.keyInProduct} placeholder="商品輸入(ID)" type="text"/></span>
                            </div>
                        </div>
                        <div className="table shoppingCart">
                            <div className="row">{`帳單編號：${currentOrder.id}`}</div>
                            <div className="head">
                                <span className="itemID">商品編號</span>
                                <span className="productName">商品名稱</span>
                                <span className="itemSpec">
                                    <span>顏色</span>
                                    <span>尺寸</span>
                                    <span>件數</span>
                                </span>
                                <span className="money">單價</span>
                                <span className="money">小計</span>
                                <span>{`共 ${currentOrder.itemList.length} 筆商品`}</span>
                            </div>
                            {
                                currentOrder.itemList.length===0?
                                <div className="note_No_item">尚未添加任何商品</div>:
                                currentOrder.itemList.map((item,itemIndex)=>(
                                    <div key={itemIndex} className="row">
                                        <span className="itemID">{item.itemID}</span>
                                        <span className="productName">{item.name}</span>
                                        <span className="itemSpec">
                                            <span>{item.color}</span>
                                            <span>{item.size}</span>
                                            <input onChange={(evnt)=>{
                                                evnt.persist();
                                                this.updateNumToBuy(evnt,itemIndex)}} type="text" value={item.saleNum}/>
                                        </span>
                                        <span className="money">{item.price}</span>
                                        <span className="money">{item.price*item.saleNum}</span>
                                    </div>
                                ))
                            }
                            <div className="footer">
                                <div className="row">
                                    <span className="sum static">
                                        <span>總計</span>
                                        <span>{this.getOrderStatic().sum?this.getOrderStatic().sum:0}</span>
                                    </span>
                                </div>
                                <div className="row">
                                    <span className="static">
                                        <span>已付訂金 </span>
                                        <span>{`${currentOrder.prePay?currentOrder.prePay:0}`}</span>
                                    </span>
                                    <span className="static"> 
                                        <span>額外折扣 </span>
                                        <input defaultValue={0}/>
                                    </span>
                                    <span className="static">
                                        <span>應收</span>
                                        <span>{`${this.getOrderStatic().receive?this.getOrderStatic().receive:0}`}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>:
                <div>訂單載入中</div>
            }            
        </div>
        )
    }
    componentDidMount(){
        let uncompletedNewOrder=JSON.parse(localStorage.getItem('uncompleted-checkout-newOrder'));
        let currentOrder;
        /** 設定current order */
        if(!uncompletedNewOrder){
            currentOrder=this.createNewOrder();
            localStorage.setItem('uncompleted-checkout-newOrder',JSON.stringify(currentOrder));       
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
            localStorage.setItem('uncompleted-checkout-newOrder',JSON.stringify(this.state.currentOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
            console.log('update to local');
        }
    }
    createNewOrder(){
        return {
            id:`${randomCheckOutOrderID()}`, 
            itemList:[], 
            customer:[], 
            time:null,
            sales:null,
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
    toogleShowCustomerForm=(bool)=>{
        this.setState(preState=>({
            isShowCustomerForm:bool,
        }))
    }
    updateNumToBuy=(evnt,itemIndex)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        let itemList=currentOrder.itemList.concat([]);
        let item=Object.assign({},itemList[itemIndex]);
        let value=evnt.target.value;
        value=value>item.stocks?item.stocks:value;
        if(String(Number(value))==="NaN"){
            value=item.stocks;
        }
        item.saleNum=value;
        itemList[itemIndex]=item;
        currentOrder.itemList=itemList;
        this.setState(preState=>({
            currentOrder,
            localStorageLock:false,
        }))
    }
    keyInCustomer=(evnt)=>{
        let target=evnt.target;
        let keyCode=evnt.charCode;
        if(keyCode===13){
            console.log(target.value);
            (async()=>{
                let result= await this.checkCustomer(target.value);
                if(result.data){
                    let customer=result.data;
                    target.value=''; /** 清空查詢 */
                    console.log(customer);
                    this.setCurrentCustomer(customer.name,customer.tel)
                }else{
                    alert(`${result.message}`)
                }
            })();
        }
        
    }
    checkCustomer=async(tel)=>{
        let result={};
        let shopRef=this.props.shop.shopRef;
        await shopRef.collection('customers').doc(tel).get()
        .then(doc=>{
            if(doc.exists){
                result.data=doc.data();
            }else{
                result.message='查無此顧客，請確認電話號碼是否有誤，或新增此顧客';
            }
        })
        return result;
    }
    setCurrentCustomer=(name,tel)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        currentOrder.customer=[name,tel];
        this.setState(preState=>({
            currentOrder,
        }))
    }
    keyInProduct=(evnt)=>{
        let target=evnt.target;
        let keyCode=evnt.charCode;
        if(keyCode===13){
            console.log(target.value);
            (async()=>{
                let result= await this.checkProduct(target.value.trim());
                if(result.product){
                    let product=result.product;
                    target.value=''; /** 清空查詢 */
                    console.log(product);
                    /** 將商品加入Order */
                    this.pushNewProductToOrder(product)
                }else{
                    alert(`${result.msg}`)
                }
            })();
        }
    }
    checkProduct=async(itemID)=>{
        let result={};
        let shopRef=this.props.shop.shopRef;
        await shopRef.collection('products').doc(itemID).get()
        .then(doc=>{
            if(doc.exists){
                result.product=doc.data();
            }else{
                result.msg=`未找到商品 ID：${itemID}`;
            }
        })
        .catch(error=>{
            console.error('ERROR\n查詢商品資料時發生錯誤！');
            console.log(error);
        })
        return result;
    }
    pushNewProductToOrder=(product)=>{
        let isExist=false;
        let currentOrder=Object.assign({},this.state.currentOrder);
        let itemList=currentOrder.itemList.concat([]);
        itemList.map(item=>{
            if(item.itemID===product.itemID){
                isExist=true;
                item.saleNum+=1;
            }
            return item;
        })
        if(!isExist){
            delete product.cost;
            delete product.purchaseID;
            delete product.time;
            delete product.productID;
            product.saleNum=1;
            itemList.push(product);
        }
        currentOrder.itemList=itemList;
        this.setState({
            currentOrder,
            localStorageLock:false,
        })     
    }
    getOrderStatic=()=>{
        let order=this.state.currentOrder;
        let result={};
        for(let item of order.itemList){
            result.sum=0;
            result.sum+=(item.price*item.saleNum);
        }
        result.receive=result.sum-order.discount-order.prePay;
        return result;
    }
}

export default CheckoutMain;