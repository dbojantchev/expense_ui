import React, { useEffect, useState } from 'react'
import {Form, InputNumber, Input, Button, Table, DatePicker, Typography, Popconfirm} from 'antd';
import './styles.css';
import InputComponent from './InputComponent'
//import Row from './Row/index'


const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode =(
            inputType === 'name' ? <Input /> :
            inputType === 'amount' ? <InputNumber /> :
            <DatePicker />
    );
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `Please input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

function TableComponent() {
    //initial expense array of  objects is empty, denoted by []
    const [form] = Form.useForm();
    const [expenses, setExpenses] = useState([])
    //const [hasChanged, setHasChanged] = useState(false); //need a state for each id
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        console.log('======failure=======1');
        form.setFieldsValue({
            id:'',
            name: '',
            amount: '',
            date: '',
            ...record,
        });
        console.log('======failure=======2');
        setEditingKey(record.key);
        console.log('======failure=======3');
        debugger
    };

    const cancel = () => {
        setEditingKey('');
    };

    const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
        }, {
            title: 'amount',
            dataIndex: 'amount',
            key: 'amount',
            editable: true,
            },{
            title: 'date',
            dataIndex: 'date',
            key: 'date',
            editable: true,
            },{
            title: 'action',
            dataIndex: 'id',
            key: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                <span>
                    <Typography.Link
                    >
                      Save
                    </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                        <a>Cancel</a>
                    </Popconfirm>
                </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
                /*<div>
                    <Button className={"editButton"}
                            disabled={!isEditing(record)}
                            onClick={()=> edit()}>
                        Edit
                    </Button>
                    <Button className={"deleteButton"}
                            onClick={()=> deleteRow(id)}>
                        Delete
                    </Button>
                </div>*/
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: (
                    col.dataIndex === 'name' ? 'text' :
                    col.dataIndex === 'amount' ? 'number' :
                    col.dataIndex === 'date' ? 'date' :
                    null
                ),
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

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

    const editRow = (id) => {
        /*const index = returnExpenseIndex(id);
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
        })*/
    }

    return (
        <>
           <InputComponent addExpense={addExpense}/>

                <Table className = "antDTable"
                       rowClassName="editable-row"
                       components={{
                           body: {
                               cell: EditableCell,
                           },
                       }}
                       dataSource={expenses}
                       columns = {mergedColumns}
                       bordered
                />

        </>
    );
}

export default TableComponent;