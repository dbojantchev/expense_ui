import React, { useEffect, useState } from 'react'
import { Form, InputNumber, Input, Button, Table} from 'antd';
import './styles.css';
import InputComponent from './InputComponent'
import Row from './Row/index'

function TableComponent() {
    //initial expense array of  objects is empty, denoted by []
    const [expenses, setExpenses] = useState([])
    const [hasChanged, setHasChanged] = useState(false); //need a state for each id
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id',
    }, {
        title: 'name',
        dataIndex: 'id',
        key: 'name',
        editable: true,
    }, {
        title: 'amount',
        dataIndex: 'id',
        key: 'amount',
        render: (amountState) => (<Input  name="amount"
                value={amountState}
                type="number"
                onChange={(e) => {
                    setHasChanged(true);
                    setAmount(e.target.value);
                }}
                placeholder="Type amount"/>
        )},{
        title: 'date',
        dataIndex: 'id',
        key: 'date',
        render: (dateState) =>(<Input  name="date"
                    value={dateState}
                    type="date"
                    onChange={(e) => {
                        setHasChanged(true);
                        setDate(e.target.value);
                    }}/>
        )},{
        title: 'action',
        dataIndex: 'id',
        key: 'action',
        render: (id, nameState, amountState, dateState ) => (
            <div>
                <Button className={"editButton"}
                        disabled={!hasChanged}
                        onClick={()=> editRow(id, nameState, amountState, dateState)}>
                    Edit
                </Button>
                <Button className={"deleteButton"}
                        onClick={()=> deleteRow(id)}>
                    Delete
                </Button>
            </div>
        )
    },
    ];

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
                data.forEach((entry) => {
                    entry.create_date = new Date(entry.create_date).toISOString().slice(0, 10);
                });
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
        console.log(`id for delete request ${id}`)
        await fetch(`/api/expense/${id}`, { method: 'DELETE' });
        getExpenses();
    }

    const deleteRowAsync = (index) => {
        const { id } = expenses[index];
        console.log(`id for deletion ${id}`)
         fetch(
            `/api/expense/${id}`,
            { method: 'DELETE' }
        )
            .then(resp => {
                console.log('Delete successful');
                getExpenses();
            })
            .catch(err => {
                console.log('======failure=======');
                console.log(err);
            });
    }

    const returnExpenseIndex = (id) => {
        const index = expenses.findIndex((ex) => ex.id === id);
        return index;
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
        const index = returnExpenseIndex(id);
        //const index = expenses.findIndex((ex) => ex.id === id);
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
            <Table className= "antDTable" dataSource={expenses}
                   columns={columns}
                   bordered
                   rowKey="id"/>
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