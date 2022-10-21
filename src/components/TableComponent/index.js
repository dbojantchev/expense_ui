import React, { useEffect, useState } from 'react'
import './styles.css';
import InputComponent from './InputComponent'
import Row from './Row'



function TableComponent() {

    const expenses = [
        {
            id: 0,
            name: "test1",
            amount: 340,
            date: '2022-10-05'
        },
        {
            id: 1,
            name: "test23",
            amount: 1144,
            date: '2022-10-04'
        }
    ]

    const addExpense = (rec) => {
        const newExpenseList = [...expenseList]
        newExpenseList.push(rec)
        setExpenseList(newExpenseList)
    }

    const deleteRow = (index) => {
        const newExpenseList = expenseList.filter((_, i) => i !== index);
        setExpenseList(newExpenseList)
    }

    const [expenseList, setExpenseList] = useState(expenses)

    return (
        <>
           <InputComponent addExpense={addExpense}/>
            {expenseList.map((ex, index) =>
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