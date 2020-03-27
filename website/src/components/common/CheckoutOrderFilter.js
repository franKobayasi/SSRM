import React,{Component, Fragment} from 'react';
import {getDateToYMD, getMillSecondFromYMD} from '../../lib';
import Checkbox from './Checkbox';


/**
This Component is return an filter that can and particular v\Checkout order collectionRef to callback.
Need Props:
callback(send data back when query is finish)
orderRef(order FireBase firestore collection ref)
 */

 class CheckoutOrderFilter extends Component{
    constructor(props){
        super(props);
        let to=getDateToYMD(new Date().valueOf());
        let from=getDateToYMD(new Date(new Date().valueOf()-(24*60*60*1000*14)).valueOf());
        this.state={
            isSearchNeedOrderID:false,
            isSearchNeedCustomerName:false,
            isSearchNeedDateArea:true,
            defaultSearchByDateFrom:from,
            defaultSearchByDateTo:to,
            searchByDateFrom:'',
            searchByDateTo:'',
            searchByCustomerName:'',
            searchOrderID:''
        }
    }
    render(){
        return (
            <div className="app-filter">
                <span className="app-filter-option">
                    <Checkbox value={this.state.isSearchNeedOrderID} onClick={()=>{this.setState(preState=>({isSearchNeedOrderID:!preState.isSearchNeedOrderID}))}} />
                    <label>結帳單號</label>
                    <input onChange={this.handleChange}  id="searchOrderID" />
                </span>
                <span className="app-filter-option">
                    <Checkbox value={this.state.isSearchNeedCustomerName} onClick={()=>{this.setState(preState=>({isSearchNeedCustomerName:!preState.isSearchNeedCustomerName}))}} />
                    <label>顧客名稱</label>
                    <input onChange={this.handleChange}  id="searchByCustomerName" />
                </span>
                <span className="app-filter-option">
                    <Checkbox value={this.state.isSearchNeedDateArea} onClick={()=>{this.setState(preState=>({isSearchNeedDateArea:!preState.isSearchNeedDateArea}))}} />
                    <label>日期區間從</label>
                    <input className="date" onChange={this.handleChange} type='date' id="searchByDateFrom" defaultValue={this.state.defaultSearchByDateFrom}/>
                    <label>至</label>
                    <input className="date" onChange={this.handleChange}  type='date' id="searchByDateTo" defaultValue={this.state.defaultSearchByDateTo} />
                </span>
                <button className="app-filter-actionBtn fx-btn--25LH-mainColor" onClick={this.searchPurchaseOrder}>查詢</button>
            </div>
        )
    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState((preState)=>({
            [id]:value
        }));
    }
    searchPurchaseOrder=()=>{
        let isSearchNeedOrderID=this.state.isSearchNeedOrderID;
        let isSearchNeedCustomerName=this.state.isSearchNeedCustomerName;
        let isSearchNeedDateArea=this.state.isSearchNeedDateArea;
        let searchOrderID=this.state.searchOrderID;
        let searchByCustomerName=this.state.searchByCustomerName;
        let targetRef=this.props.orderRef;
        if(isSearchNeedOrderID&&searchOrderID.length===0){
            alert('在勾選以結帳單號搜尋時，該欄位不得為空');
        }else if(isSearchNeedCustomerName&&searchByCustomerName.length===0){
            alert('在勾選以顧客名稱搜尋時，該欄位不得為空');
        }else{
            if(isSearchNeedOrderID){
                targetRef=targetRef.where('id','==',`${searchOrderID}`);
            }
            if(isSearchNeedCustomerName){               
                targetRef=targetRef.where('customerIdAndName','array-contains',`${searchByCustomerName}`)
            }
            if(isSearchNeedDateArea){
                let from=this.state.searchByDateFrom?this.state.searchByDateFrom:this.state.defaultSearchByDateFrom;
                let to=this.state.searchByDateTo?this.state.searchByDateTo:this.state.defaultSearchByDateTo;
                from=getMillSecondFromYMD(from);
                to=getMillSecondFromYMD(to)+((23*60+59)*60*1000);
                if(from>to){
                    from=to-((23*60+59)*60*1000);
                }
                targetRef=targetRef.where('time','>=',from).where('time','<=',to);
            }
            this.props.callback(targetRef);
        }
    }
 }

 export default CheckoutOrderFilter;