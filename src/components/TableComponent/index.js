import React, { useEffect, useState } from 'react'
import './styles.css';
import InputComponent from './InputComponent'
import Row from './Row/index'

function TableComponent() {
    //initial expense array of  objects is empty, denoted by []
    const [expenses, setExpenses] = useState([])

    const getExpenses = () => {
        fetch(
            '/api/expense?q=proxy',
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(resp => {
                resp.json().then((data) => {
                    sortExpenses(data);
                    setExpenses(data);
                });
            })
            .catch(err => {
                console.log('======failure=======');
                console.log(err);
            });
    }
    //hook below used to update the database
    useEffect(() => {
        getExpenses();
    }, [])

    const addExpense = (rec) => {
        /*const newExpenseList = [...expenses]
        newExpenseList.push(rec)
        setExpenses(newExpenseList)*/
        const data = rec
        console.log("new entry"+rec+"\n")
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
        fetch(
            'api/expense',
            requestOptions
        ).then(
            (res) => res.json()
        ).then((data) => {
                console.log('Success:', data);
                getExpenses();
            }
        ).catch(err => {
            console.log('======failure=======')
            console.log(err)
        })
    };

    const deleteRow = async (id) => {
        await fetch(`/api/expense/${id}`, { method: 'DELETE' });
        getExpenses();
    }

    const sortExpenses = (data) => {
        data.sort((a, b) => {
            a = parseInt(a.id);
            b = parseInt(b.id);
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });
        return data;
    }

    const editRow = (id, newName, newAmount, newDate) => {

        const index = expenses.findIndex((ex) => ex.id === id);
        console.log(`index for of array ${index}`)
        console.log(`id for put request ${id}`)
        const rowAttributes  = {"id": id , "name": newName, "amount": newAmount, "date": newDate};

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowAttributes)
        }
        fetch(
            `api/expense/${id}`,
            requestOptions
        ).then(
            (res) => res.json()
        ).then(
            (rowAttributes) => {
                console.log('Success:', rowAttributes);
            }
        ).catch(err => {
            console.log('======failure=======')
            console.log(err)
        })
    }

    return (
        <>
            <InputComponent addExpense={addExpense}/>
            {expenses.map((ex, index) =>
                <Row
                    id={ex.id}
                    name={ex.name}
                    amount={ex.amount}
                    date={ex.create_date}
                    //editEnterKeyPress={editEnterKeyPress}
                    handleEdit={editRow}
                    handleDelete={deleteRow}
                />
            )}
        </>
    );
}

export default TableComponent;

