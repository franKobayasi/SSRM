import React,{ Component } from "react";
import {connect} from "react-redux";

class Analysis extends Component{
    constructor(props){
        super(props);

    }
    render(){
        return <div> Analysis Page </div>
    }
}

export default connect()(Analysis);