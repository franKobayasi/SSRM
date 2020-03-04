import React from 'react';
/**
This Component is to implement checkbox,
value is bool, for active or not,
onClick is callback for updating the father component's value'.
 */
 
function Checkbox(props){
    let isActive=props.value;
    return (
        <span className='app-checkbox' onClick={props.onClick}>
            <span className={isActive?'app-checkbox-inner-active':'app-checkbox-inner'}></span>
        </span>
    )
}
export default Checkbox;