import React,{Fragment} from "react";
import {roundAfterPointAt} from "../../../../lib";
/** other resource */
import editImg from "../../../../img/editBtn.png";
import deleteImg from "../../../../img/deleteBtn.png";

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
        {
            order.products&&order.products.map((product,index)=>(
            <div key={index} id={product.id} className="productBox">
                {
                    product.itemList.map((item,index)=>{
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
                })
                }
                {     
                    mode==="create"?
                    <Operator 
                    modifyProduct={props.modifyProduct} 
                    deleteProduct={props.deleteProduct}/>:
                    props.onOrderEditing?
                    <Operator 
                    modifyProduct={props.modifyProduct} 
                    deleteProduct={props.deleteProduct}/>:
                    null
                }
            </div> 
        ))}
        {
            mode==="create"?
            <div onClick={props.startProductAdding} className="addNewProduct btn">+</div>:
            props.onOrderEditing?
            <div onClick={props.startProductAdding} className="addNewProduct btn">+</div>:
            null
        }
    </div>
    )
}

function Operator(props){
    return (
         <Fragment>
         <img className="edit" src={editImg} onClick={props.modifyProduct}/>
         <img className="delete" src={deleteImg} onClick={props.deleteProduct}/>
         </Fragment>
    )
}


export default ContentTable;