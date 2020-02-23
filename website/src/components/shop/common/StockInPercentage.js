import React from 'react';

function StockInPercentage(props) {
    let order=props.order
    let sumOfInStock=0;
    for(let item of order.itemList){
        sumOfInStock+=item.inStock;
    }
    let number=sumOfInStock===0?0:roundAfterPointAt((sumOfInStock)/order.static.sumOfNum);
    let style={
        width:number
    }
    return (
        <span className="showPercentage">
            <span className="color" style={style}>.</span>{`${number*100}%`}
        </span>
    )
}

export default StockInPercentage;