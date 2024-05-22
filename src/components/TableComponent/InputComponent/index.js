import React, { useEffect, useState } from 'react'
import {Input, Button} from 'antd';
import './styles.css';

function InputComponent({addExpense}) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [reloaded, setReloaded] = useState(true);

    useEffect(() => {
        //checking for valid input
        //console.log("Checking name:");
        if(reloaded){
            setReloaded(false);
        }else{
            if(name.length == 0){
                setErrorMessage('Name cannot be Empty');
            }else{
                setErrorMessage('')
                setName(name);
            }
        }
        amount < 0 ? setErrorMessage('Please enter a positive number for amount!') : setAmount(amount);
    }, [name, amount])

    return (
        <>
           <div className={"input-group"}>
               <span className={"column-name"}>Name:</span>
                <Input type="text" value={name}
                       onChange={(e) => setName(e.target.value)}/>
               <span className={"column-name"}>Amount:</span>
                <Input type="number" id="amount" value={amount}
                       onChange={(e) => setAmount(e.target.value)}/>
               <span className={"column-name"}>Date:</span>
                <Input type="date" id="date" value="add" value={date}
                       onChange={(e) => setDate(e.target.value)}/>
                <button className="add-button" disabled={errorMessage.length > 0} onClick={() => addExpense({name, amount, date})}>Add Entry!</button>
               {errorMessage && <div className="error"> {errorMessage} </div>}
           </div>
        </>

    );
}

export default InputComponent;