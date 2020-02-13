import React,{ Component,Fragment } from "react";
import {randomPurchaseOrderID} from "../../../lib";
class OrderCreating extends Component{
    constructor(props){
        super(props);
        this.state={
            currentOrder:'undefined',
            onProductEditing:false,
            onSupplierAdding:false
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
    showSupplierAddingForm=()=>{
        this.setState(preState=>({
            onSupplierAdding:!preState.onSupplierAdding,
        }))
    }
    submitNewSupplier=()=>{
        let supplier={
            title:this.state.tempSupplierName,
            address:this.state.tempSupplierAddress,
            phone:this.state.tempSupplierPhone
        }
        alert('註冊成功！')
        // 發送api
        // alert('新增失敗，請稍後再試')
        // alert('新增成功')
        this.setState(preState=>({
            tempSupplierName:'',
            tempSupplierAddress:'',
            tempSupplierPhone:'',
            onSupplierAdding:false,
        }))
    }
    componentDidMount(){
        let currentOrder;
        if(!this.props.uncompletedNewOrder){
            currentOrder={
                id:`${randomPurchaseOrderID()}`
            };
            localStorage.setItem('uncompleted-purchase-newOrder',JSON.stringify(currentOrder));
            
        }else{
            currentOrder=this.props.uncompletedNewOrder;
        }
        this.setState(preState=>({
            currentOrder,
        }))   
    }
    render(){
        let onProductEditing=this.state.onProductEditing;
        let onSupplierAdding=this.state.onSupplierAdding;
        let currentOrder=this.state.currentOrder;

        console.log(currentOrder);
        /**
            order={
                id,
                products:[
                    products...
                ],
                provider: token
            }
         */

        return (
            <Fragment>
                {/* 新增供應商 */}
                <form className="addNewSupplierForm" style={onSupplierAdding?{display:"block"}:{display:"none"}}>
                    <div><label>供應商</label><input id="tempSupplierName" onChange={this.handleChange}/></div>
                    <div><label>地址</label><input id="tempSupplierAddress" onChange={this.handleChange}/></div>
                    <div><label>電話</label><input id="tempSupplierPhone" onChange={this.handleChange} placeholder={"這將作為查詢使用"}/></div>
                    <div className="buttons">
                        <button className="finish">完成</button>
                        <button className="cancel">取消</button>
                    </div>
                </form>
                {/* 新增產品表單 */}
                <form className="addNewProductForm" style={onProductEditing?{display:"block"}:{display:"none"}}>
                    <div className="basicInfo">
                        <div className="productID">產品編號: random number</div>
                        <div><label className="title">商品名稱</label><input className="productName" /></div>
                        <div><label className="title">進貨成本</label><input className="productCost" /></div>
                        <div><label className="title">商品標價</label><input className="productPrice" /></div>
                    </div>
                    <div className="productSpec">
                        <div>
                            <label>尺寸</label><input />
                            <label>顏色</label><input />
                            <label>件數</label><input />
                        </div>    
                        <div className="addNewSpec_btn">+</div>
                    </div>
                </form>
                <div className="operatingArea">
                    <div className="currentInfo">
                        <div>採購管理 \ 採購登入</div>
                        <div>user: <span>{`Frank Lin`}</span></div>
                    </div>
                    <div className="operatingBtns">
                        <button>歷史訂單</button> {/*返回訂單歷史*/}
                        <button>庫存查詢</button>
                        <button>修改訂單</button>
                        <button onClick={this.showSupplierAddingForm}>新增供應商</button>
                    </div>
                </div>
                <div className="informationArea">
                    <div className="basicInfo">
                        <span className="number">{`採購單號 ${currentOrder.id}`}</span>
                        <Supplier provider={currentOrder.provider}/>
                    </div>
                    <div className="innerOperatingArea">
                        <input placeholder="供應商搜尋(電話)"/>
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
                            <span className="productTypeID">產品編號</span>
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
                        {currentOrder.itemList&&currentOrder.itemList.map((item,index)=>(
                            <div key={index} className="itemBox">
                                <span className="productID">{currentOrder.productTypeID}</span>
                                <span className="itemID">{item.productID}</span>
                                <span className="productName">{item.productName}</span>
                                <span className="itemSpec">{item.size}</span>
                                <span className="itemSpec">{item.color}</span>
                                <span className="itemSpec">{item.num}</span>
                                <span className="productCost">{item.cost}</span>
                                <span className="sumOfCostPerRow">{`${item.num*item.cost}`}</span>
                                <span className="productPrice">{item.price}</span>
                                <span className="productProfit">{`${(item.price-item.cost)/item.cost}`}</span>
                            </div>
                        ))}
                        <div className="addNewProduct">+</div>
                    </div>
                    <div className="buttons">
                        <button className="styleFormLittleBtn finish">完成</button>
                        <button className="styleFormLittleBtn cancel">取消</button>
                    </div>
                    <div className="totalInfo">
                        <span>成本總計</span><span className="sumOfCost">15200</span>
                        <span>平均利潤</span><span className="sumOfProfit">{(42000-15200)/42000}</span>
                    </div>
                </div>
            </Fragment>
        )
    }
}

/**
    product={
        productID,
        productName,
        cost,
        price,
        itemList:[
            {
                itemID,
                size,
                num,
                color,
            }
        ]
    }
 */

function productBox(product) {
    return (
        <div className="productBox">
            {product.itemList.map((item,index)=>{
                return (
                    <div key={index} className="itemBox">
                        <span className="productID">{product.productID}</span>
                        <span className="itemID">{item.itemID}</span>
                        <span className="productName">{product.productName}</span>
                        <span className="itemSpec">{item.size}</span>
                        <span className="itemSpec">{item.color}</span>
                        <span className="itemSpec">{item.num}</span>
                        <span className="productCost">{product.cost}</span>
                        <span className="sumOfCostPerRow">{`${item.num*product.cost}`}</span>
                        <span className="productPrice">{product.price}</span>
                        <span className="productProfit">{`${(item.price-item.cost)/item.cost}`}</span>
                    </div>
                )
            })}
            <button className="styleFormLittleBtn edit">編輯</button>
        </div> 
    )
}

class Supplier extends Component{
    constructor(props){
        super(props);
        this.state={
            isNeedUpdate:true,
            title:'Loading..',
            address:'Loading..首爾市時代廣場A座3樓16C',
        }
    }
    componentDidMount(){
        //get supplier data from database then update to state
    }
    render(){
        return (
            <Fragment>
                <span className="title">供應商：</span>
                <span className="SupplierDetail">{this.state.title}</span>
                <span className="title">商家地址：</span>
                <span className="SupplierAddress">{this.state.address}</span>
            </Fragment>
        )
    }
}

export default OrderCreating;