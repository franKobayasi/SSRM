import React,{Fragment, Component} from 'react';
import {connect} from "react-redux";

class AppHeaderBar extends Component{
    constructor(props){
        super(props);
    }
    toggleAppMode=()=>{

    }

    render(){
        let mode=this.state.isNavShow;
        return (
            <div id="app-headerBar">
                <span>Reborn中正台門市</span>
                <span>後台模式</span>
            </div>
        )
    }
}

export default connect()(AppSideNav);