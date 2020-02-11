import React,{ Component,Fragment } from "react";
import {connect} from "react-redux";
/** Component */
import SideNav from '../layout/SideNav';

class Stock extends Component{
    constructor(props){
        super(props);
        this.state={
            shop:{
                currentShop:'Reborn中正台門市',
                currentUser:'Frank'
            }
        }
    }
    render(){
        console.log(this.props);
        let isEdit=false;
        let productTypeID=`202002M${myrandomstring().toUpperCase()}`;
        let start=1;
        let order={
            start:1,
            productTypeID:productTypeID,
            itemList:[
                {
                    productID:`${productTypeID}${start++}`,
                    productName:'袖打結針織上衣',
                    size:'S',
                    color:'咖啡',
                    num:'5',
                    price:'2000',
                    cost:'1200'
                },
                {
                    productID:`${productTypeID}${start++}`,
                    productName:'袖打結針織上衣',
                    size:'M',
                    color:'白',
                    num:'6',
                    price:'2000',
                    cost:'1200'
                },
                {
                    productID:`${productTypeID}${start++}`,
                    productName:"袖打結針織上衣",
                    size:'M',
                    color:'藍',
                    num:'10',
                    price:'2000',
                    cost:'1200'
                }
            ]
        }
        const show={
            display:"block"
        }
        const hide={
            display:"none"
        }
        return (
            <Fragment>
                <SideNav auth={this.props.auth} currentShop={this.state.shop}/>
                <div className="shopMainArea">
                {/* add new product */}
                <form className="addNewProductForm" style={isEdit?show:hide}>
                    <div className="basicInfo">
                        <div className="productID">產品編號: random number</div>
                        <div><label className="title">商品名稱</label><input className="productName" /></div>
                        <div><label className="title">進貨成本</label><input className="productCost" /></div>
                        <div><label className="title">商品標價</label><input className="productPrice" /></div>
                    </div>
                    <div className="productSpec">
                        <div><label>尺寸</label><input /><label>顏色</label><input /><label>件數</label><input /></div>
                        
                        <div className="addNewSpec_btn">+</div>
                    </div>
                </form>
                    <div className="operatingArea">
                        <div className="currentInfo">
                            <div>庫存管理 \ 入庫作業</div>
                            <div>user: <span>{`Frank Lin`}</span></div>
                        </div>
                        <div className="operatingBtns">
                            <button>新建訂單</button> {/*返回訂單歷史*/}
                            <button>再建一筆</button>
                            <button>修改訂單</button>
                            <button>新增供應商</button>
                        </div>
                    </div>
                    <div className="informationArea">
                        <div className="basicInfo">
                            <span className="number">{`採購單號 ${2020021100001}`}</span>
                            <span className="title">供應商：</span>
                            <span className="SupplierDetail">SUPPLIER</span>
                            <span className="title">商家地址：</span>
                            <span className="SupplierAddress">首爾市時代廣場A座3樓16C</span>
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
                                <span className="productID">商品牌號</span>
                                <span className="productName">商品名稱</span>
                                <span className="productSpec">尺寸</span>
                                <span className="productSpec">顏色</span>
                                <span className="productSpec">件數</span>
                                <span className="productCost">進貨單價</span>
                                <span className="sumOfCostPerRow">成本小計</span>
                                <span className="productPrice">商品標價</span>
                                <span className="productProfit">單項利潤</span>
                            </div>
                            {order.itemList.map((item,index)=>{
                                return (
                                    <div key={index} className="productBox">
                                        <span className="productTypeID">{order.productTypeID}</span>
                                        <span className="productID">{item.productID}</span>
                                        <span className="productName">{item.productName}</span>
                                        <span className="productSpec">{item.size}</span>
                                        <span className="productSpec">{item.color}</span>
                                        <span className="productSpec">{item.num}</span>
                                        <span className="productCost">{item.cost}</span>
                                        <span className="sumOfCostPerRow">{`${item.num*item.cost}`}</span>
                                        <span className="productPrice">{item.price}</span>
                                        <span className="productProfit">{`${(item.price-item.cost)/item.cost}`}</span>
                                    </div>
                                )
                            })}
                            <div className="addNewProduct">+</div>
                            <div className="totalInfo"></div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

// JS 產生亂數 by mtchang.tw@gmail.com
// 亂數產生
function randomusefloor(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}
// 亂數英文字
function makerandomletter(max) {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < max; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
// 前兩碼英文小寫,後6碼數字
function myrandomstring() {
    return makerandomletter(2)+randomusefloor(1,999999);
}

function mapStateToProps({auth}){
    return {
        auth,
    }
}
export default connect(mapStateToProps)(Stock);

