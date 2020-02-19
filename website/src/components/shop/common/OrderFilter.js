import React,{Component, Fragment} from 'react';
import Selector from './Selector';

/**
This Component is return an filter that can and particular order collection to callback.
Now Support Purchase order and Checkout orders.
Need Props:
callback()
shopRef()
 */

 class StockOrderFilter extends Component{
    constructor(props){
         super(props);
         this.state={
             options:[
                 {title:'供應商',value:'以供應商搜尋'},
                 {title:'採購單號',value:'以採購單號搜尋'},
                 {title:'商品編號',value:'以itemID搜尋'}
             ]
             condition:null,
             searchValue:null,
         }
    }
    render(){
        let options=this.state.options;
        return (
            <div className="orderFilter">
                <span>搜尋條件：</span><Selector callbackOfSelect={this.getSelectedValue} options={options} defaultValue={'請選擇搜尋條件'}/>
                <input onChange={this.handleChange} id='searchValue' /><button onCliclk={}>搜尋</button>
            </div>
        )
    }
    componentDidMount(){

    }
    handleChange=(evnt)=>{
        let id=evnt.target.id;
        let value=evnt.target.value;
        this.setState((preState)=>({
            [id]:value
        }));
    }
    getSelectedValue=(value)=>{
        this.setState(preState=>({
            condition:value,
        }))
    }
    search=()=>{
        let options=this.state.options;
        let stocksRef=this.props.shop.shopRef.collection('stocks');
        let searchValue=this.state.searchValue;
        if(!searchValue){
            alert('搜尋內容不得為空');
        }else if(!condition){
            alert('尚未選擇搜尋條件');
        }
        if(condition===options[0].value){
            // 以供應商搜尋
            stocksRef.where('suppliers','array-contains',searchValue)
             .then(snapshot=>{
                 if(snapshot.empty){
                     alert('查無符合條件的訂單資訊');
                 }else{
                     
                 }
             })
        }
        
    }
 }

 export default OrderFilter;