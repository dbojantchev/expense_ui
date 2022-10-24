import React, { useEffect, useState } from 'react'
import './styles.css';
import InputComponent from './InputComponent'
import Row from './Row'

function TableComponent() {

    const [expenses, setExpenses] = useState([])

    useEffect(() => {
        fetch(
            '/api/expense?q=proxy',
            {headers: {
                    'Content-Type': 'application/json'
                }}
        )
            .then(resp => {
                resp.json().then((data) => {
                    console.log(JSON.stringify(data))
                    setExpenses(data);
                });
            })
            .catch(err => {
                console.log('======failure=======');
                console.log(err);
            });
    }, [])

    const addExpense = (rec) => {
        const newExpenseList = [...expenses]
        newExpenseList.push(rec)
        setExpenses(newExpenseList)
    }

    const deleteRow = (index) => {
        const newExpenseList = expenses.filter((_, i) => i !== index);
        setExpenses(newExpenseList)
    }

    return (
        <>
           <InputComponent addExpense={addExpense}/>
            {expenses.map((ex, index) =>
                <div className={"rowAndButton"}>
                    <Row
                         id={ex.id}
                         name={ex.name}
                         amount={ex.amount}
                         date={ex.date}
                    />
                    <button className={"deleteButton"} onClick={() => deleteRow(index)}>Delete</button>
                </div>
            )}
        </>
    );
}

export default TableComponent;