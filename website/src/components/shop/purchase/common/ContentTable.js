import React,{Fragment} from "react";
import {roundAfterPointAt} from "../../../../lib";
/** other resource */
import editBtn from "../../../../img/editBtn.png";
import deleteBtn from "../../../../img/deleteBtn.png";
import addeBtn from "../../../../img/addBtn.png";

/**
    need props: 
    mode (could be create or detail);
    order(data to be render);
    onOrderEditing(only be provided when the mode is detail)
    modifyProduct(callback function when click modify btn) 
    deleteProduct(callback function when click delete btn)
    startProductAdding(callback function when click adding btn)

    no connect to store, pure func for view render. 
 */
function ContentTable(props){
    let mode=props.mode;
    let order=props.order;
    return (
    <div className="table">
        <div className="head">
            <span className="itemID">商品牌號</span>
            <span className="productName">商品名稱</span>
            <span className="itemSpec">尺寸</span>
            <span className="itemSpec">顏色</span>
            {mode==="create"?
            <span className="itemSpec">件數</span>:
            <Fragment>
                <span className="itemSpec">採購件數</span>
                <span className="itemSpec">入庫件數</span>
                <span className="itemSpec">狀態</span>
            </Fragment>}
            <span className="itemSpec">進貨單價</span>
            <span className="itemSpec">成本小計</span>
            <span className="itemSpec">商品標價</span>
            <span className="itemSpec">單項利潤</span>
        </div>
        {
            order.products.map((product,productIndex)=>(
                <Fragment key={productIndex}>
                    <div className="row">
                        <span>{`產品編號：${product.productID}`}</span>
                        {mode==="create"?
                        <Operator modifyProduct={()=>{props.modifyProduct(productIndex)}} 
                                    deleteProduct={()=>{props.deleteProduct(productIndex)}}/>:
                        props.onOrderEditing?
                        <Operator modifyProduct={()=>{props.modifyProduct(productIndex)}} 
                                    deleteProduct={()=>{props.deleteProduct(productIndex)}}/>:null}
                    </div>
                    {product.itemList.map((item,itemIndex)=>(
                        <div key={itemIndex} className="row">
                            <span className="itemID">{item.itemID}</span>
                            <span className="productName">{product.name}</span>
                            <span className="itemSpec">{item.size}</span>
                            <span className="itemSpec">{item.color}</span>
                            {mode==="create"?
                            <span className="itemSpec">{item.num}</span>:
                            <Fragment>
                                <span className="itemSpec">{item.num}</span>
                                <span className="itemSpec">{item.inStock}</span>
                                <span className="itemSpec">{item.status}</span>
                            </Fragment>}
                            <span className="itemSpec">{product.cost}</span>
                            <span className="itemSpec">{`${item.num*product.cost}`}</span>
                            <span className="itemSpec">{product.price}</span>
                            <span className="itemSpec">{`${roundAfterPointAt(((product.price-product.cost)/product.price),2)}`}</span>
                        </div>
                    ))}
                </Fragment>))
        }
        {mode==="create"?
        <div  className="row"><img className="defaultStyleBtn" src={addeBtn} onClick={props.startProductAdding} /></div>:
        props.onOrderEditing?
        <div  className="row"><img className="defaultStyleBtn" src={addeBtn} onClick={props.startProductAdding} /></div>:null}
    </div>
    )
}

function Operator(props){
    return (
         <Fragment>
         <img className="defaultStyleBtn" src={editBtn} onClick={props.modifyProduct}/>
         <img className="defaultStyleBtn" src={deleteBtn} onClick={props.deleteProduct}/>
         </Fragment>
    )
}

export default ContentTable;