import React,{Component,Fragment} from 'react';
/** component */
import Checkbox from '../common/Checkbox';

/**
This component is for Stock order creating component's selected order info
need props:
orderSelected(the selected order information)
callback(sent out the selected itemList);

 */

class SelectedOrder extends Component{
    constructor(props){
        super(props);
    }
    render(){
        let isAllSelected=this.props.isAllSelected;
        let orderSelected=this.props.orderSelected;
        return (
            <div className="selectedOrderInfo fk-table">
                <div className="orderInfoHeader fk-table-highlighter">
                    <span><label>採購單號：</label><span>{orderSelected?orderSelected.id:'尚未選擇訂單'}</span></span>
                    <span><label>全選</label><Checkbox value={isAllSelected} onClick={this.props.toSelectAll} /></span>
                </div>
                <div className="tableSmall">
                    <div className="fk-table-header">
                        <span className="fk-table-cell-175px">產品編號</span>
                        <span className="fk-table-cell-150px">產品名稱</span>
                        <span className="fk-table-cell-50px">尺寸</span>
                        <span className="fk-table-cell-50px">顏色</span>
                        <span className="fk-table-cell-50px">總採購</span>
                        <span className="fk-table-cell-50px">未入庫</span>
                        <span className="fk-table-cell-50px">已入庫</span>
                    </div>
                {   
                    orderSelected?
                    orderSelected.itemList.length===0?
                    <div className="fk-table-header">此訂單無尚未完成進貨的商品</div>:
                    orderSelected.itemList.map((item,index)=>(
                        <ItemInfo  key={index} item={item} isActive={this.props.tempItemState[`${item.itemID}`]} 
                        updateItemList={()=>{this.props.changeItemState(item.itemID);}}/>
                    )):
                    <div className="fk-table-header">沒有搜尋到任何符合條件的訂單</div>
                }
                </div>
                <button className="fx-btn--25lH-mainColor" onClick={this.props.callback}>批次添加</button>
            </div>
        )
    }
}

function ItemInfo(props){
    let item=props.item;
    let updateItemList=props.updateItemList;
    return (
        <div className="itemInfo row">
            <span className="itemID">{item.itemID}</span>
            <span className="productName">{item.name}</span>
            <span className="itemSpec">{item.size}</span>
            <span className="itemSpec">{item.color}</span>
            <span className="itemSpec">{item.num}</span>
            <span className="itemSpec">{item.num-(item.inStock?item.inStock:0)}</span>
            <span className="itemSpec">{item.inStock?item.inStock:0}</span>
            <span className="pcs"> Pcs</span>
            <Checkbox value={props.isActive} onClick={updateItemList}/>
        </div>
    )
}

export default SelectedOrder;