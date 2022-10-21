import React from 'react'
import './Row.css';

function Row({id, name, amount, date,}) {


    return (
        <div className={"row"}>
            <div className={"cell"}>{id}</div>
            <div className={"cell"}>{name}</div>
            <div className={"cell"}>{amount}</div>
            <div className={"cell"}>{date}</div>
        </div>
    );
}

export default Row;