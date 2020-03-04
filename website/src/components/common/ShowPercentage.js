import React from 'react';
import {roundAfterPointAt} from "../../lib";

function ShowPercentage(props) {
    let order=props.order
    let sumOfInStock=0;
    for(let item of order.itemList){
        sumOfInStock+=item.inStock;
    }
    let number=sumOfInStock===0?0:roundAfterPointAt((sumOfInStock)/order.static.sumOfNum,2);
    let style={
        width:number===1?'100%':`${number*100}%`
    }
    return (
        <span className="app-percentage">
            <span className="color" style={style}></span>
            <span className="text">{`${roundAfterPointAt(number*100,2)}%`}</span>
        </span>
    )
}

export default ShowPercentage;