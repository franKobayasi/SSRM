import React,{ Fragment,Component } from "react";
import {connect} from "react-redux";
import {ssrmDB} from '../../useFirebase';
import {randomCheckOutOrderID, roundAfterPointAt} from '../../lib';
/** component */
import FormSubmitBooking from "./FormSubmitBooking";
import {Loading} from '../common/Loading';
import {FormCustomerEntry, Customer} from '../common/Customer';
import StockChecker from '../common/StockChecker';

/**
實現結帳功能：



 */

class CheckoutCreate extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:null,
            localStorageLock:true,
            isShowCustomerForm:false,
            isShowFormSubmitBooking:false,
            isShowStockChecker:false,
            discount:0,
        }
    }
    render(){
        let isShowCustomerForm=this.state.isShowCustomerForm;
        let isShowFormSubmitBooking=this.state.isShowFormSubmitBooking;
        let isShowStockChecker=this.state.isShowStockChecker;
        let currentOrder=this.state.currentOrder;
        let discount=this.state.discount;

        return (
        <div className="app-pageMainArea app-checkout-new">
            {
                isShowFormSubmitBooking?
                <FormSubmitBooking toggle={this.toggleFormSubmitBooking} setDeposit={this.setDeposit} />:null
            }
            {
                isShowCustomerForm?
                <FormCustomerEntry shopRef={this.props.shopRef} callback={this.toogleShowCustomerForm} />:null
            }{
                isShowStockChecker?
                <StockChecker toggle={this.toggleShowStockChecker}/>:null
            }
            <div className="app-pageMainArea-header">
                <div className="location">
                    <div>位置：結帳台</div>
                </div>
                <div className="operatingBtns">
                    <button className="fx-btn--mainColor" onClick={()=>{this.toogleShowCustomerForm(true)}}>新增會員</button>
                    <button className="fx-btn--mainColor" onClick={()=>{this.toggleFormSubmitBooking(true)}}>預付訂金</button>
                    <button className="fx-btn--mainColor">未結暫存</button>
                    <button className="fx-btn--mainColor" onClick={()=>{this.toggleShowStockChecker(true)}}>庫存查詢</button>
                    <button onClick={()=>{this.props.history.history.push('/checkout/history')}} className="fx-btn--mainColor">歷史查詢</button>
                </div>
            </div>
            <div className="app-pageMainArea-main">
            {
                currentOrder?
                <Fragment>
                <div className="orderContent">
                    <div className="orderContent-header">
                        <div className="orderid">
                            <label>結帳單號</label>
                            <span>{currentOrder.id}</span>
                        </div>
                        <div className="keyInArea">
                            <Customer shopRef={this.props.shopRef} customer={currentOrder.customer}/>
                            <input className="keyIn--black" onKeyPress={this.keyInCustomer} placeholder="會員查詢(TEL)" type="text"/>
                            <input className="keyIn--black" onKeyPress={this.keyInProduct} placeholder="商品輸入(ID)" type="text"/>
                        </div>
                    </div>
                    <div className="orderContent-main fk-table">
                        <div className="fk-table-header">
                            <span className="fk-table-cell-175px">商品編號</span>
                            <span className="fk-table-cell-150px">商品名稱</span>
                            <span className="fk-table-cell-50px">顏色</span>
                            <span className="fk-table-cell-50px">尺寸</span>
                            <span className="fk-table-cell-50px">件數</span>
                            <span className="fk-table-cell-75px">單價</span>
                            <span className="fk-table-cell-75px">小計</span>
                            <span className="fk-table-cell-100px fk-table-floatR">{`共 ${currentOrder.itemList.length} 筆商品`}</span>
                        </div>
                        <div className="fk-table-scrollArea">
                        {
                            currentOrder.itemList.length===0?
                            <div className="fk-table-row fk-table-highlighter">尚未添加任何商品</div>:
                            currentOrder.itemList.map((item,itemIndex)=>(
                                <div key={itemIndex} className="fk-table-row">
                                    <span className="fk-table-cell-175px">{item.itemID}</span>
                                    <span className="fk-table-cell-150px">{item.name}</span>
                                    <span className="fk-table-cell-50px">{item.color}</span>
                                    <span className="fk-table-cell-50px">{item.size}</span>
                                    <input className="fk-table-cell-50px" onChange={(evnt)=>{
                                    evnt.persist();
                                    this.updateNumToBuy(evnt,itemIndex)}} type="text" value={item.saleNum}/>
                                    <span className="fk-table-cell-75px">{item.price}</span>
                                    <span className="fk-table-cell-75px">{item.price*item.saleNum}</span>
                                    <span className="fk-table-cell-100px fk-table-floatR">
                                        <span onClick={()=>(this.deleteProductFromOrder(itemIndex))} className="fx-btn-little-nobg">刪除</span>
                                    </span>
                                </div>
                            ))
                        }
                        </div>
                        <div className="fk-table-footer">
                            <div className="fk-table-row">
                                <span className="calcResult">
                                    <label className="fk-table-cell-50px">總計</label>
                                    <span className="fk-table-cell-75px">{currentOrder.calcResult.sumOfMoney}</span>
                                </span>
                            </div>
                            <div className="fk-table-row">
                                <span className="calcResult">
                                    <label className="fk-table-cell-50px">應收</label>
                                    <span className="fk-table-cell-75px">{`${currentOrder.calcResult.receive}`}</span>
                                </span>
                                <span className="calcResult">
                                    <label className="fk-table-cell-75px">額外折扣 </label>
                                    <input className="keyIn--black fk-table-cell-75px" type="text" onChange={this.updateDiscount} value={discount}/>
                                </span>
                                <span className="calcResult">
                                    <label className="fk-table-cell-75px">已付訂金 </label>
                                    <span className="fk-table-cell-75px">{`${currentOrder.calcResult.deposit}`}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="orderContent-footer">
                        <div className="actionBtns">
                            <button onClick={this.cancelOrder} className="fx-btn--25LH-mainColor">取消</button>
                            <button onClick={this.submitOrder} className="fx-btn--25LH-mainColor">結帳</button>
                        </div>
                    </div>
                </div>
                </Fragment>:
                null   
            }
            </div>
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
            calcResult:{
                sumOfMoney:0,
                sumOfNum:0,
                discount:0,
                deposit:0,
                receive:0,
            },
            time:null,
            // status: done - undone - booking
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
    toggleShowStockChecker=(bool)=>{
        this.setState(preState=>({
            isShowStockChecker:bool,
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
        let shopRef=this.props.shopRef;
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
            localStorageLock:false,
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
        let shopRef=this.props.shopRef;
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
                if(item.saleNum===item.stocks){
                    alert(`該商品目前已輸入 ${item.saleNum} 件，已達此商品當前庫存，請確認！`);
                }else{
                    item.saleNum=Number(item.saleNum)+1;
                }
            }
            return item;
        })
        if(!isExist){
            delete product.cost;
            delete product.purchaseID;
            delete product.time;
            delete product.productID;
            if(product.stocks===0){
                alert('此商品目前已無庫存，請確認！')
            }else{
                product.saleNum=1;
                itemList.push(product);
            }
        }
        currentOrder.itemList=itemList;
        currentOrder.calcResult=this.getCalcResult(itemList);
        this.setState({
            currentOrder,
            localStorageLock:false,
        })     
    }
    deleteProductFromOrder=(itemIndex)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        let itemList=currentOrder.itemList.concat([]);
        itemList.splice(itemIndex,1);
        currentOrder.itemList=itemList;
        currentOrder.calcResult=this.getCalcResult(itemList);
        this.setState({
            currentOrder,
            localStorageLock:false,
        }) 
    }
    getCalcResult=(list,deposit,discount)=>{
        let result={};
        let itemList;
        let order=this.state.currentOrder;
        itemList=list?list:order.itemList;
        result.sumOfMoney=0;
        result.sumOfNum=0;
        for(let item of itemList){
            result.sumOfNum+=item.saleNum;
            result.sumOfMoney+=(item.price*item.saleNum)
        }
        result.deposit=deposit||deposit===0?deposit:order.calcResult.deposit;
        result.discount=discount||discount===0?discount:order.calcResult.discount;
        result.receive=(result.sumOfMoney-result.discount)-result.deposit;
        return result;
    }
    toggleFormSubmitBooking=(bool)=>{
        this.setState(preState=>({
            isShowFormSubmitBooking:bool,
        }))
    }
    setDeposit=(deposit)=>{
        let currentOrder=Object.assign({},this.state.currentOrder);
        currentOrder.calcResult=this.getCalcResult(null,deposit,null);
        this.setState(preState=>({
            currentOrder,
            localStorageLock:false,
        }))
    }
    updateDiscount=(evnt)=>{
        let value=evnt.target.value;
        let currentOrder=Object.assign({},this.state.currentOrder);
        let isDiscountRight=String(Number(value))!=="NaN";
        if(isDiscountRight){
            this.setDiscount(Number(value));
        }else{
            this.setDiscount(0);
        }
        this.setState(preState=>({
            discount:value,
        }))
    }
    setDiscount=(discount)=>{
        console.log(discount);
        let currentOrder=Object.assign({},this.state.currentOrder);
        currentOrder.calcResult=this.getCalcResult(null,null,discount);
        this.setState(preState=>({
            currentOrder,
            localStorageLock:false,
        }))
    }
    cancelOrder=()=>{
        let currentOrder=this.createNewOrder();
        this.setState(preStat=>({
            currentOrder,
            localStorageLock:false,
        }))
    }
    submitOrder=()=>{
        let shopRef=this.props.shopRef;
        let currentOrder=Object.assign({},this.state.currentOrder);
        if(currentOrder.customer.length===0){
            alert('尚未輸入顧客資料，請確認！');
            return ;
        }
        if(currentOrder.itemList.length===0){
            alert('尚未添加任何商品資料，請確認！');
            return ;
        }
        let transaction=ssrmDB.runTransaction(t=>{
            currentOrder.time=new Date().valueOf();
            currentOrder.status='done';
            let promises=[];
            for(let item of currentOrder.itemList){
                let updateProduct=t.get(shopRef.collection('products').doc(item.itemID))
                .then(doc=>{
                    if(doc.exists){
                        let product=doc.data();
                        product.stocks-=item.saleNum;
                        //扣庫存
                        t.set(shopRef.collection('products').doc(item.itemID),product);
                    }
                })
                promises.push(updateProduct);
            }
            let updateCustomerTradeRecord=t.get(shopRef.collection('customers').doc(currentOrder.customer[1]))
            .then(doc=>{
                if(doc.exists){
                    let customer=doc.data();
                    if(!customer.tradeRecords){
                        customer.tradeRecords={};
                    }
                    customer.tradeRecords[currentOrder.id]=currentOrder.calcResult;
                    customer.tradeRecords[currentOrder.id].time=currentOrder.time;
                    t.set(shopRef.collection('customers').doc(currentOrder.customer[1]),customer)
                }
            })
            promises.push(updateCustomerTradeRecord);
            let addOrder=t.set(shopRef.collection('checkouts').doc(currentOrder.id),currentOrder);
            promises.push(addOrder);
            return Promise.all(promises);
        })
        .then(res=>{
            alert('結帳成功！');
            let currentOrder=this.createNewOrder();
            this.setState(preState=>({
                currentOrder,
                discount:0,
                localStorageLock:false,
            }))
        })
        .catch(error=>{
            alert('結帳失敗！');
            console.log(error);
        })
    }
}

export default CheckoutCreate;