import React,{Fragment} from "react";
import {roundAfterPointAt} from "../../lib";
/** other resource */
import editBtn from "../../img/editBtn.png";
import deleteBtn from "../../img/deleteBtn.png";
import addeBtn from "../../img/addBtn.png";

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
    console.log(props);
    return (
    <div className="fk-table orderContent-main">
        <div className="fk-table-header fk-table-row">
            <span className="fk-table-cell-175px">商品牌號</span>
            <span className="fk-table-cell-150px">商品名稱</span>
            <span className="fk-table-cell-50px">尺寸</span>
            <span className="fk-table-cell-50px">顏色</span>
            {mode==="create"?
            <span className="fk-table-cell-50px">件數</span>:
            <Fragment>
                <span className="fk-table-cell-50px">採購件數</span>
                <span className="fk-table-cell-50px">入庫件數</span>
                <span className="fk-table-cell-50px">狀態</span>
            </Fragment>}
            <span className="fk-table-cell-100px">進貨單價</span>
            <span className="fk-table-cell-100px">成本小計</span>
            <span className="fk-table-cell-100px">商品標價</span>
            <span className="fk-table-cell-100px">單項利潤</span>
        </div>
        {
            order.products.map((product,productIndex)=>(
                <Fragment key={productIndex}>
                    <div className="fk-table-row">
                        <span className="flag">{`產品編號：${product.productID}`}</span>
                        {mode==="create"?
                        <Operator modifyProduct={()=>{props.modifyProduct(productIndex)}} 
                                    deleteProduct={()=>{props.deleteProduct(productIndex)}}/>:
                        props.onOrderEditing?
                        <Operator modifyProduct={()=>{props.modifyProduct(productIndex)}} 
                                    deleteProduct={()=>{props.deleteProduct(productIndex)}}/>:null}
                    </div>
                    {product.itemList.map((item,itemIndex)=>(
                        <div key={itemIndex} className="fk-table-row">
                            <span className="fk-table-cell-175px">{item.itemID}</span>
                            <span className="fk-table-cell-150px">{product.name}</span>
                            <span className="fk-table-cell-50px">{item.size}</span>
                            <span className="fk-table-cell-50px">{item.color}</span>
                            {mode==="create"?
                            <span className="fk-table-cell-50px">{item.num}</span>:
                            <Fragment>
                                <span className="fk-table-cell-50px">{item.num}</span>
                                <span className="fk-table-cell-50px">{item.inStock}</span>
                                <span className="fk-table-cell-50px">{item.status}</span>
                            </Fragment>}
                            <span className="fk-table-cell-100px">{product.cost}</span>
                            <span className="fk-table-cell-100px">{`${item.num*product.cost}`}</span>
                            <span className="fk-table-cell-100px">{product.price}</span>
                            <span className="fk-table-cell-100px">{`${roundAfterPointAt(((product.price-product.cost)/product.price),2)}`}</span>
                        </div>
                    ))}
                </Fragment>))
        }
        {
            mode==="create"?
            <div  className="fx-btn--Img-25px">
                <img src={addeBtn} onClick={props.startProductAdding} />
            </div>:
            props.onOrderEditing?
            <div  className="fx-btn--Img-25px">
                <img src={addeBtn} onClick={props.startProductAdding} />
            </div>:
            null
        }
    </div>
    )
}

function Operator(props){
    return (
         <Fragment>
         <img className="fx-btn--Img-25px" src={editBtn} onClick={props.modifyProduct}/>
         <img className="fx-btn--Img-25px" src={deleteBtn} onClick={props.deleteProduct}/>
         </Fragment>
    )
}

export default ContentTable;