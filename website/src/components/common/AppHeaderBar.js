import React,{Fragment, Component} from 'react';
import {connect} from 'react-redux';
import {Toggle} from './Toggle';
import {actionToggleShopMode} from '../../actions/shop';

class AppHeaderBar extends Component{
    constructor(props){
        super(props);
    }
    toggleAppMode=()=>{
        this.props.dispatch(actionToggleShopMode());
    }
    render(){
        let onCheckoutMode=this.props.shop.onCheckoutMode;
        let shop=this.props.shop;
        return (
            <div className="app-headerBar">
                <span className="app-headerBar-shopTitle">{shop.title}</span>
                <span className="app-headerBar-operateArea">
                    <span id="appModeToggle">
                        <label>{onCheckoutMode?'結帳模式':'後台模式'}</label>
                        <Toggle isOn={onCheckoutMode} toggle={this.toggleAppMode} />
                    </span>
                </span>
            </div>
        )
    }
}

function mapStateToProps({shop}){
    return {
        shop,
    };
}
function mapDispatchToProps(dispatch){
    return {
        dispatch,
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(AppHeaderBar);