import React,{ Fragment,Component } from "react";
import {connect} from "react-redux";
import {ssrmDB} from '../../useFirebase';
import {randomCheckOutOrderID, roundAfterPointAt} from '../../lib';
/** component */
import FormSubmitBooking from "./FormSubmitBooking";
import {Loading} from '../common/Loading';
import ModifySubmit from '../common/ModifySubmit';
import {FormCustomerEntry, Customer} from '../common/Customer';
import StockChecker from '../common/StockChecker';

/**
修改結帳單細節，刪除訂單：

 */

class CheckoutDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            orderID:this.props.history.match.params.orderid,
            onEditMode:false,
            currentOrder:null,
            localStorageLock:true,
            isShowCustomerForm:false,
            isShowFormSubmitBooking:false,
            isShowStockChecker:false,
            isShowModifySubmit:false,
        }
    }
    render(){
        let discount=this.state.discount;
        let history=this.props.history.history;
        let orderID=this.state.orderID;
        let onEditMode=this.state.onEditMode;
        let isShowModifySubmit=this.state.isShowModifySubmit;
        let isShowCustomerForm=this.state.isShowCustomerForm;
        let isShowFormSubmitBooking=this.state.isShowFormSubmitBooking;
        let isShowStockChecker=this.state.isShowStockChecker;
        let currentOrder=this.state.currentOrder;
        let unsavedHistoryOrder=this.state.unsavedHistoryOrder;
        let orderToRender=onEditMode?unsavedHistoryOrder:currentOrder;

        return (
        <div className="app-pageMainArea app-checkout-detail">
        {
            isShowModifySubmit?
            <ModifySubmit title="結帳單修正" submit={this.submitModifySubmit} cancel={this.cancelModifySubmit}/>:
            null
        }
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
                    <div>{`位置：訂單詳情`}</div>
                </div>
                <div className="operatingBtns">
                    <button className="fx-btn--mainColor" onClick={()=>{this.toogleShowCustomerForm(true)}}>新增會員</button>
                {
                    onEditMode?
                    <Fragment>
                        <button className="fx-btn--mainColor" onClick={()=>{this.toggleFormSubmitBooking(true)}}>預付訂金</button>
                    </Fragment>:
                    null
                }
                    <button className="fx-btn--mainColor" onClick={()=>{this.toggleShowStockChecker(true)}}>庫存查詢</button>
                    <button onClick={()=>{history.push('/checkout/history')}} className="fx-btn--mainColor">歷史結帳列表</button>
                </div>
            </div>
            <div className="app-pageMainArea-main">
            {
                orderToRender?
                <Fragment>
                <div className="orderContent">
                    <div className="orderContent-header">
                        <div className="orderid">
                            <label>結帳單號</label>
                            <span>{orderToRender.id}</span>
                        </div>
                    {
                        onEditMode?
                        <div className="keyInArea">
                            <Customer shopRef={this.props.shopRef} customer={orderToRender.customer}/>
                            <input className="keyIn--black" onKeyPress={this.keyInCustomer} placeholder="會員查詢(TEL)" type="text"/>
                            <input className="keyIn--black" onKeyPress={this.keyInProduct} placeholder="商品輸入(ID)" type="text"/>
                        </div>:
                        <Customer shopRef={this.props.shopRef} customer={orderToRender.customer}/>
                    }
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
                            <span className="fk-table-cell-100px fk-table-floatR">{`共 ${orderToRender.itemList.length} 筆商品`}</span>
                        </div>
                        <div className="fk-table-scrollArea">
                        {
                            orderToRender.itemList.length===0?
                            <div className="fk-table-row fk-table-highlighter">尚未添加任何商品</div>:
                            orderToRender.itemList.map((item,itemIndex)=>(
                                <div key={itemIndex} className="fk-table-row">
                                    <span className="fk-table-cell-175px">{item.itemID}</span>
                                    <span className="fk-table-cell-150px">{item.name}</span>
                                    <span className="fk-table-cell-50px">{item.color}</span>
                                    <span className="fk-table-cell-50px">{item.size}</span>
                                {
                                    onEditMode?
                                    <input className="fk-table-cell-50px" onChange={(evnt)=>{
                                    evnt.persist();
                                    this.updateNumToBuy(evnt,itemIndex)}} type="text" value={item.saleNum}/>:
                                    <span className="fk-table-cell-50px">{item.saleNum}</span>
                                }
                                    <span className="fk-table-cell-75px">{item.price}</span>
                                    <span className="fk-table-cell-75px">{item.price*item.saleNum}</span>
                                {
                                    onEditMode?
                                    <span className="fk-table-cell-100px fk-table-floatR">
                                        <span onClick={()=>(this.deleteProductFromOrder(itemIndex))} className="fx-btn--onlyText-black">刪除</span>
                                    </span>:
                                    null
                                }
                                </div>
                            ))
                        }
                        </div>
                        <div className="fk-table-footer">
                            <div className="fk-table-row">
                                <span className="calcResult">
                                    <label className="fk-table-cell-50px">總計</label>
                                    <span className="fk-table-cell-75px">{orderToRender.calcResult.sumOfMoney}</span>
                                </span>
                            </div>
                            <div className="fk-table-row">
                                <span className="calcResult">
                                    <label className="fk-table-cell-50px">應收</label>
                                    <span className="fk-table-cell-75px">{`${orderToRender.calcResult.receive}`}</span>
                                </span>
                                <span className="calcResult">
                                    <label className="fk-table-cell-75px">額外折扣 </label>
                                {
                                    onEditMode?
                                    <input className="keyIn--black fk-table-cell-75px" type="text" onChange={this.updateDiscount} value={orderToRender.calcResult.discount}/>:
                                    <span className="fk-table-cell-75px">{orderToRender.calcResult.discount}</span>
                                }
                                </span>
                                <span className="calcResult">
                                    <label className="fk-table-cell-75px">已付訂金 </label>
                                    <span className="fk-table-cell-75px">{`${orderToRender.calcResult.deposit}`}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="orderContent-footer">
                        <div className="actionBtns">
                        {
                            onEditMode?
                            <Fragment>
                                <button onClick={this.cancelUpdateOrder} className="fx-btn--25LH-mainColor">取消</button>
                                <button onClick={()=>{this.toggleShowModifySubmit(true)}} className="fx-btn--25LH-mainColor">儲存</button>
                            </Fragment>:
                            <button onClick={this.startToEditOrder} className="fx-btn--25LH-mainColor">編輯</button>
                        }
                        </div>
                    </div>
                </div>
                </Fragment>:
                <Loading text="訂單資料載入中.."/>
            }
            </div>
        </div>
        )
    }
    componentDidMount(){
        this.getOrderData();
    }
    componentDidUpdate(){
        /** auto upadte order to localStorage */
        let orderID=this.state.orderID; 
        if(!this.state.localStorageLock){
            localStorage.setItem(`checkout-history-${orderID}`,JSON.stringify(this.state.unsavedHistoryOrder))
            this.setState(preState=>({
                localStorageLock:true,
            }))
            console.log('update to local');
        }
    }
    startToEditOrder=()=>{
        let orderID=this.state.orderID;
        let unsavedHistoryOrder=JSON.parse(localStorage.getItem(`checkout-history-${orderID}`));
        console.log(!unsavedHistoryOrder);
        if(!unsavedHistoryOrder)
            unsavedHistoryOrder=this.state.currentOrder;
        this.setState(preState=>({
            onEditMode:true,
            unsavedHistoryOrder,
            localStorageLock:false,
        }))
    }
    getOrderData=()=>{
        this.props.shopRef.collection('checkouts').doc(this.state.orderID).get()
        .then(doc=>{
            if(!doc.exists){
                alert('找不到符合的訂單資料！');
                this.props.history.history.push('/checkout/history/');
            }else{
                this.setState(preState=>({
                    currentOrder:doc.data(),
                }))
            }
        })
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
    toggleShowModifySubmit=(bool)=>{
        this.setState(preState=>({
            isShowModifySubmit:bool,
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
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        unsavedHistoryOrder.customer=[name,tel];
        this.setState(preState=>({
            unsavedHistoryOrder,
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
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        let itemList=unsavedHistoryOrder.itemList.concat([]);
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
        unsavedHistoryOrder.itemList=itemList;
        unsavedHistoryOrder.calcResult=this.getCalcResult(itemList);
        this.setState({
            unsavedHistoryOrder,
            localStorageLock:false,
        })     
    }
    updateNumToBuy=(evnt,itemIndex)=>{
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        let itemList=unsavedHistoryOrder.itemList.concat([]);
        let item=Object.assign({},itemList[itemIndex]);
        let value=evnt.target.value;
        value=value>item.stocks?item.stocks:value;
        if(String(Number(value))==="NaN"){
            value=item.stocks;
        }
        item.saleNum=value;
        itemList[itemIndex]=item;
        unsavedHistoryOrder.itemList=itemList;
        unsavedHistoryOrder.calcResult=this.getCalcResult(itemList);
        this.setState(preState=>({
            unsavedHistoryOrder,
            localStorageLock:false,
        }))
    }
    deleteProductFromOrder=(itemIndex)=>{
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        let itemList=unsavedHistoryOrder.itemList.concat([]);
        itemList.splice(itemIndex,1);
        unsavedHistoryOrder.itemList=itemList;
        unsavedHistoryOrder.calcResult=this.getCalcResult(itemList);
        this.setState({
            unsavedHistoryOrder,
            localStorageLock:false,
        }) 
    }
    getCalcResult=(list,deposit,discount)=>{
        let result={};
        let itemList;
        let onEditMode=this.state.onEditMode;
        let order=onEditMode?this.state.unsavedHistoryOrder:this.state.currentOrder;
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
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        unsavedHistoryOrder.calcResult=this.getCalcResult(null,deposit,null);
        this.setState(preState=>({
            unsavedHistoryOrder,
            localStorageLock:false,
        }))
    }
    updateDiscount=(evnt)=>{
        let value=evnt.target.value;
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        let isDiscountRight=String(Number(value))!=="NaN";
        if(isDiscountRight){
            this.setDiscount(Number(value));
        }else{
            this.setDiscount(0);
        }
    }
    setDiscount=(discount)=>{
        console.log(discount);
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        unsavedHistoryOrder.calcResult=this.getCalcResult(null,null,discount);
        this.setState(preState=>({
            unsavedHistoryOrder,
            localStorageLock:false,
        }))
    }
    cancelUpdateOrder=()=>{
        if(confirm('有尚未完成儲存的變更，確定放棄編輯？')){
            localStorage.removeItem(`checkout-history-${this.state.orderID}`)
            this.setState(preState=>({
                onEditMode:false,
                unsavedHistoryOrder:null,
            }),this.getOrderData)
        }
    }
    submitModifySubmit=(operator,reason)=>{
        let shopRef=this.props.shopRef;
        let unsavedHistoryOrder=Object.assign({},this.state.unsavedHistoryOrder);
        if(unsavedHistoryOrder.customer.length===0){
            alert('尚未輸入顧客資料，請確認！');
            return ;
        }
        if(unsavedHistoryOrder.itemList.length===0){
            alert('尚未添加任何商品資料，請確認！');
            return ;
        }
        if(operator.length<1){
            alert('操作人員未填寫或長度過短');
            return ;
        }
        if(reason.length<5){
            alert('修改原因未填寫或長度過短');
            return ;
        }
        let transaction=ssrmDB.runTransaction(async(t)=>{
            if(!unsavedHistoryOrder.modifyRecords){
                unsavedHistoryOrder.modifyRecords=[];
            }
            unsavedHistoryOrder.modifyRecords.push({
                reason,
                operator,
                time:new Date().valueOf(),
            });
            let promises=[];
            let previousCheckout;
            await t.get(shopRef.collection('checkouts').doc(unsavedHistoryOrder.id))
            .then(doc=>{
                if(doc.exists){
                    previousCheckout=doc.data();
                }
            });
            if(previousCheckout){
                // 回復先前的;
                for(let item of previousCheckout.itemList){
                    let itemUpdate=t.get(shopRef.collection('products').doc(item.itemID))
                    .then(doc=>{
                        let product=doc.data();
                        product.stocks+=Number(item.saleNum);
                        t.set(shopRef.collection('products').doc(item.itemID),product)
                    })
                    .catch(error=>{
                        console.log('ERROR\n產品庫存更新失敗');
                        console.error(error);
                    })
                    promises.push(itemUpdate); //加回庫存
                    let tradeRecordsUpdate=t.get(shopRef.collection('customers').doc(previousCheckout.customer[1]))
                    .then(doc=>{
                        let customer=doc.data();
                        delete customer.tradeRecords[previousCheckout.id];
                        t.set(shopRef.collection('customers').doc(previousCheckout.customer[1]),customer)
                    })
                    .catch(error=>{
                        console.log('ERROR\n顧客交易紀錄，更新失敗');
                        console.error(error);
                    })
                    promises.push(tradeRecordsUpdate); //更新顧客交易紀錄   
                }
                // 扣除當前的;
                for(let item of unsavedHistoryOrder.itemList){
                    let updateProduct=t.get(shopRef.collection('products').doc(item.itemID))
                    .then(doc=>{
                        if(doc.exists){
                            let product=doc.data();
                            product.stocks-=Number(item.saleNum);
                            //扣庫存
                            t.set(shopRef.collection('products').doc(item.itemID),product);
                        }
                    })
                    promises.push(updateProduct);
                }
                let updateCustomerTradeRecord=t.get(shopRef.collection('customers').doc(unsavedHistoryOrder.customer[1]))
                .then(doc=>{
                    if(doc.exists){
                        let customer=doc.data();
                        if(!customer.tradeRecords){
                            customer.tradeRecords={};
                        }
                        customer.tradeRecords[unsavedHistoryOrder.id]=unsavedHistoryOrder.calcResult;
                        customer.tradeRecords[unsavedHistoryOrder.id].time=unsavedHistoryOrder.time;
                        t.set(shopRef.collection('customers').doc(unsavedHistoryOrder.customer[1]),customer)
                    }
                })
                promises.push(updateCustomerTradeRecord);
                let addOrder=t.set(shopRef.collection('checkouts').doc(unsavedHistoryOrder.id),unsavedHistoryOrder);
                promises.push(addOrder);
                return Promise.all(promises);
            }else{
                alert('更新失敗，找無此交易紀錄');
            }            
        })
        .then(res=>{
            alert(`交易 ${unsavedHistoryOrder.id} 更新成功！`);
            localStorage.removeItem(`checkout-history-${this.state.orderID}`)
            this.setState(preState=>({
                onEditMode:false,
                isShowModifySubmit:false,
                unsavedHistoryOrder:null,
            }),this.getOrderData)
        })
        .catch(error=>{
            alert(`交易 ${unsavedHistoryOrder.id} 更新失敗！`);
            console.error('ERROR\n交易紀錄更新失敗');
            console.log(error)
        })
    }
    cancelModifySubmit=()=>{
        this.toggleShowModifySubmit(false);
    }
}

export default CheckoutDetail;