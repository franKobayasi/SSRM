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
        let orderType=this.props.orderType;
        return (
            <div className="selectedOrder">
                <div className="selectedOrder-header">
                    <span className="orderid"><label>採購單號：</label><span>{orderSelected?orderSelected.id:'尚未選擇訂單'}</span></span>
                    <span className="selectAll"><label>全選</label><Checkbox value={isAllSelected} onClick={this.props.toSelectAll} /></span>
                </div>
                <div className="selectedOrder-main fk-table">
                    <div className="fk-table-header">
                        <span className="fk-table-cell-150px">產品編號</span>
                        <span className="fk-table-cell-125px">產品名稱</span>
                        <span className="fk-table-cell-50px">尺寸</span>
                        <span className="fk-table-cell-50px">顏色</span>
                        <span className="fk-table-cell-50px">總採購</span>
                        <span className="fk-table-cell-50px">未入庫</span>
                        <span className="fk-table-cell-50px">已入庫</span>
                    </div>
                {   
                    orderSelected?
                    orderSelected.itemList.length===0?
                    <div className="fk-table-highlighter">{orderType==='stockin'?'所選擇的採購單已完成商品進貨':'所選擇的採購單尚未有入庫的商品'}</div>:
                    orderSelected.itemList.map((item,index)=>(
                        <ItemInfo  key={index} item={item} isActive={this.props.tempItemState[`${item.itemID}`]} 
                        updateItemList={()=>{this.props.changeItemState(item.itemID);}}/>
                    )):
                    <div className="fk-table-highlighter">沒有搜尋到任何符合條件的訂單</div>
                }
                </div>
                <div className="selectedOrder-footer">
                    <button className="fx-btn--25LH-mainColor" onClick={this.props.callback}>批次添加</button>
                </div>
            </div>
        )
    }
}

function ItemInfo(props){
    let item=props.item;
    let updateItemList=props.updateItemList;
    return (
        <div className="fk-table-row">
            <span className="fk-table-cell-150px">{item.itemID}</span>
            <span className="fk-table-cell-125px">{item.name}</span>
            <span className="fk-table-cell-50px">{item.size}</span>
            <span className="fk-table-cell-50px">{item.color}</span>
            <span className="fk-table-cell-50px">{item.num}</span>
            <span className="fk-table-cell-50px">{item.num-(item.inStock?item.inStock:0)}</span>
            <span className="fk-table-cell-50px">{item.inStock?item.inStock:0}</span>
            <Checkbox value={props.isActive} onClick={updateItemList}/>
        </div>
    )
}

export default SelectedOrder;