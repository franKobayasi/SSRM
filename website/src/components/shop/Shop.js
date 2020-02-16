import {createHashHistory as history} from 'history';
import React,{Component} from "react";
import {connect} from "react-redux";
import {
    HashRouter as Router, 
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom';
/** firebase */
import ssrmFirebase,{fbAuthProvider,ssrmDB,getDataFromFireBase} from "../../useFirebase";
/** action creators */
import {actionShopSignIn,actionShopSignOut} from '../../actions/shop';
/** component */
import ShopAuth from './shopauth/ShopAuth';
import ShopSignIned from './shopauth/ShopSignIned';

class Shop extends Component{
    constructor(props){
        super(props);
        this.state={
            shop:{
                id:this.props.match.params.shopid,
            },
            isWrongID:'uncheck',
        };
    }
    componentDidMount(){
        /** 
            to get shop current state and info from firebase
            - state is signIn: 【state is signIned】
                update shop info to redux and turn to ShopSignIned component;
            - state is signOut: 【state is signOuted】
                set shop basic info to state and sent to ShopSignOuted component via props;
            - wrong shop id: 【state is uncheck】
                alert and then go back to dashboard;
        */
        let auth=this.props.auth;
        let shopid=this.state.shop.id;
        let shopRef=ssrmDB.collection('members').doc(auth.MEMBER_UID).collection('shops').doc(shopid);
        shopRef.get().then(doc=>{
            if(doc.exists){
                let shop=doc.data();
                shop.id=doc.id;
                // 尚未登入
                if(shop.currentUser==="undefined"){
                    console.log('no user sign in shop yet');
                    this.props.dispatch(actionShopSignOut());
                }else{
                    this.props.dispatch(actionShopSignIn({
                        user:shop.currentUser,
                        title:shop.title,
                        id:shop.id,
                    }))
                    console.log('shop auto login');
                }
                this.setState(preState=>({
                    shop:{
                        ...preState.shop,
                        title:shop.title,
                    },
                    isWrongID:false,
                }));
            }else{ // 店家不存在，錯誤店家代碼
                this.setState(preState=>({
                    isWrongID:true,
                }))
            }
        })
    }
    componentDidUpdate(){

    }
    render(){
        let shop=this.props.shop;
        let isWrongID=this.state.isWrongID;
        if(isWrongID==="uncheck"){
            return <div>shop data loading...</div>
        }else if(isWrongID===true){
            alert('錯誤的店家代碼，即將返回會員主控頁');
            history().push('/dashboard');
            return null;
        }else{
            return (
                shop.user==="undefined"?
                <ShopAuth currentShop={this.state.shop}/>:
                <ShopSignIned shopUrl={this.props.match.url} shop={this.state.shop}/>
            )   
        } 
    }
}

function mapStateToProps({auth, shopList, shop},ownProps){
    return {
        auth,
        shopList,
        shop,
    };
}

export default connect(mapStateToProps)(Shop);