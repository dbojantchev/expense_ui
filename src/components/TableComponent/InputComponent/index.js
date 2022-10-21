import React, { useEffect, useState } from 'react'
import './styles.css';


function InputComponent({addExpense}) {
    const [name, setName] = useState("")
    const [amount, setAmount] = useState(0)
    const [date, setDate] = useState("")
    const [errorMessage, setErrorMessage] = useState('')

   useEffect(() => {
       console.log("Checking name:");

       (typeof amount !== 'number' || amount < 0) ?
            setErrorMessage('Please enter a positive number for amount!')
            : setAmount(amount)


       !name ? setErrorMessage('Name cannot be Empty') : setName(name)
    }, [name, amount])

    /*const checkAmount = (amount) =>{
        (typeof amount !== 'number' || amount < 0) ?
            setErrorMessage('Please enter a positive number for amount!')
            : setAmount(amount)

    }

    const checkEmpty = (name) => {
        console.log("Checking name:" + name)
         !name ? setErrorMessage('Name cannot be Empty') : setName(name)
    }*/

    return (
        <>
           <div className={"input-group"}>
               <span className={"column-name"}>Name:</span>
                <input type="text" value={name}
                       onChange={(e) => setName(e.target.value)}/>
               <span className={"column-name"}>Amount:</span>
                <input type="text" id="amount" value={amount}
                       onChange={(e) => setAmount(e.target.value)}/>
               <span className={"column-name"}>Date:</span>
                <input type="date" id="date" value="add" value={date}
                       onChange={(e) => setDate(e.target.value)}/>
                <button onClick={() => addExpense({name, amount, date})}>Add</button>
               {errorMessage && <div className="error"> {errorMessage} </div>}
           </div>
        </>

    );
}

export default InputComponent;