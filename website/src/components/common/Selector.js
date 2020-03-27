import React,{ Component,Fragment } from 'react';
import triangleImg from '../../../img/triangle.png';

class Selector extends Component{
    constructor(props){
        super(props);
        this.state={
            selected:null,
            isShow:false
        }
    }
    showOptions=()=>{
        this.setState(preState=>({
            isShow:true
        }))
    }
    optionClick=(evnt)=>{
        let selected=evnt.target;
        this.setState(preState=>({
            selected:selected.title,
            isShow:false
        }))
        this.props.callbackOfSelect(selected.value);
    }
    render(){
        let selected=this.state.selected;
        let defaultValue=this.props.defaultValue;
        return (
            <div className="selector">
                <div className="selectedOption">
                    <span>{selectedValue?selectedValue:defaultValue}</span><img src={triangleImg}/>
                </div>
                {
                    this.state.isShow?
                    <div className="optionBox">
                    {
                        this.props.options.map(option=>(
                            <div className="option" value={option.value}>{option.title}</div>
                        ))
                    }
                    </div>:null
                }
            </div>
        )
    }
}

export default Selector;