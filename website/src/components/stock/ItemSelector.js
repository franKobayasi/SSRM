import React,{Component,Fragment} from 'react';
/** component */
import PurchaseOrderFilter from '../common/PurchaseOrderFilter';
import {ToggleCol} from '../common/Toggle';
import SelectedOrder from './SelectedOrder';
import Checkbox from '../common/Checkbox';
import ShowPercentage from '../common/ShowPercentage';

/**
Need Props:
shopRef(for firebase data search)
isShow(wheather show this component to view)
callback(get itemList back to OrderCreating component)
*/

class ItemSelector extends Component{
    constructor(props){
        super(props);
        this.state={
            isShowSearchPanel:false,
            orderSelected:null,
            tempItemState:null,
            isAllSelected:false,
            orderSearchResult:null
        }
    }
    render(){
        let orderSearchResult=this.state.orderSearchResult;
        let orderSelected=this.state.orderSelected;
        let isShowSearchPanel=this.state.isShowSearchPanel;
        let orderRef=this.props.shopRef.collection('purchases');
        let orderType=this.props.orderType;
        return (
            <div className={`app-stock-itemSelector${isShowSearchPanel?'--show':''}` }>
                <span className="searchToggle">
                    <label>{`採購單查詢面板 ${isShowSearchPanel?'ON':'OFF'}`}</label>
                    <ToggleCol isOn={isShowSearchPanel} toggle={this.searchPanelToggle} />
                </span>
                <div className="orderSearchArea">
                    {/* PurchaseOrderFilter */}
                    <PurchaseOrderFilter orderRef={orderRef} callback={this.getSearchResult}/>
                    <div className="orderSelector fk-table">
                        <div className="fk-table-header">
                            <span className="fk-table-cell-175px">採購單號</span>
                            <span className="fk-table-cell-150px">供應商名稱</span>
                            <span className="fk-table-cell-100px">供應商電話</span>
                            <span className="fk-table-cell-100px">進貨完成度</span>
                        </div>
                        <div className="fk-table-scrollArea">
                        {   
                            orderSearchResult?
                            orderSearchResult.length===0?
                            <div className="fk-table-highlighter">沒有搜尋到任何符合條件的訂單</div>:
                            orderSearchResult.map((order,index)=>(
                                <OlderSummary active={orderSelected?orderSelected.id===order.id?true:false:false} key={index} order={order} selectOrder={()=>{this.selectOrder(index)}}/>
                            )):
                            <div className="fk-table-highlighter">沒有搜尋到任何符合條件的訂單</div>
                        }
                        </div>
                    </div>
                </div>
                <SelectedOrder orderType={orderType} orderSelected={orderSelected} callback={this.getItemListBackToTap} changeItemState={this.changeItemState}   
                toSelectAll={this.toSelectAll} isAllSelected={this.state.isAllSelected} tempItemState={this.state.tempItemState} />
            </div>
        )
    }
    searchPanelToggle=()=>{
        this.setState(preState=>({
            isShowSearchPanel:!preState.isShowSearchPanel,
        }))
    }
    getSearchResult=(targetRef)=>{
        targetRef.orderBy('time','desc').get()
        .then(snapshot=>{
            let result=[];
            if(!snapshot.empty){
                snapshot.forEach(doc=>{
                    result.push(doc.data());
                })
            }
            this.setState(preState=>({
            orderSearchResult:result,
        }))
        })
    }
    selectOrder=(index)=>{
        /** 讓已經完成進貨的商品的不要被選到 */
        let orderSearchResult=this.state.orderSearchResult;
        let orderSelected=Object.assign({},orderSearchResult[index])
        if(this.props.orderType==='stockin'){
           orderSelected.itemList=orderSelected.itemList.filter(item=>{
               return item.status!='finish';
           });
        }else{
            orderSelected.itemList=orderSelected.itemList.filter(item=>{
                return item.status!='purchase';
            })
        }
        let tempItemState={};
        for(let item of orderSelected.itemList){
            tempItemState[item.itemID]=false;
        }
        this.setState(preState=>({
            orderSelected,
            tempItemState,
            isAllSelected:false,
        }))
    }
    /** handle SelectedOrder's item */
    changeItemState=(itemID)=>{
        let tempItemState=Object.assign({},this.state.tempItemState);
        tempItemState[itemID]=!tempItemState[itemID];
        this.setState(preState=>({
            tempItemState,
        }))
    }
    toSelectAll=()=>{
        let tempItemState=Object.assign({},this.state.tempItemState);
        for(let key in tempItemState){
            tempItemState[key]=!this.state.isAllSelected;
        }
        this.setState(preState=>({
            tempItemState,
            isAllSelected:!preState.isAllSelected,
        }))
    }
    getItemListBackToTap=()=>{
        let order={};
        let itemList=[];
        let orderSelected=Object.assign({},this.state.orderSelected);
        let tempItemState=this.state.tempItemState;
        if(!orderSelected.itemList){
            alert('尚未選擇欲進貨的採購單');
        }else{
            for(let item of orderSelected.itemList){
                if(tempItemState[item.itemID]){
                    delete item.status;
                    item.operateNum=0;
                    itemList.push(item);
                }
            }
            if(itemList.length===0){
                alert('尚未添加任何商品');
            }else{
                order.itemList=itemList;
                order.purchaseID=orderSelected.id;
                order.updateTimes=orderSelected.updateTimes;
                this.props.callback(order);
                this.setState(preState=>({
                    isAllSelected:false,
                    orderSelected:null,
                    tempItemState:null,
                }))
            }
        }
    }
}

function OlderSummary(props){
    let order=props.order
    return (
        <div onClick={props.selectOrder} className={`olderSummary btn fk-table-row ${props.active?'active':''}`}>
            <span className="fk-table-cell-175px">{order.id}</span>
            <span className="fk-table-cell-150px">{order.search_supplier[0]}</span>
            <span className="fk-table-cell-100px">{order.search_supplier[2]}</span>
            <span className="fk-table-cell-100px fk-table-LH0"><ShowPercentage order={order}/></span>
        </div>
    )
}

export default ItemSelector;