import React,{ Component } from "react";
import {connect} from "react-redux";

class SettingAndOther extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return <div> Setting and Other Page </div>
    }
}

export default connect()(SettingAndOther);