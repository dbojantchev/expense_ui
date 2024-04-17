import React, { useEffect, useState } from 'react'
import {Form, InputNumber, Input, Button, Modal, Table, Space, DatePicker, Typography} from 'antd';
import './styles.css';
import InputComponent from './InputComponent'
import SearchComponent from './SearchComponent'
//import Row from './Row/index'


function TableComponent() {
    //initial expense array of  objects is empty, denoted by []
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const [expenses, setExpenses] = useState([])

    //const isEditing = (record) => record.key === editingKey;
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const onEditRow = (record) => {
        console.log(`show modal from  id ${record.id}`);
        setSelectedRow(record);
        setIsEditModalOpen(true);
    };

    const handleSubmit = (values) => {
        const {name} =  values;
        const {amount} =  values;
        const {date} =  values;
        console.log(`name ${name} amount ${amount} date ${date} from row id ${selectedRow.id}`);
        editRow(selectedRow.id, name, amount, date);
        handleCancel();
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
    };

    const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'amount',
            dataIndex: 'amount',
            key: 'amount',
        },{
            title: 'date',
            dataIndex: 'date',
            key: 'date',
        },{
            title: 'action',
            key: 'action',
            render: (record) => (
                <div>
                    <Space>
                        <Button className={"editButton"}  
                                onClick={() => onEditRow(record)}
                        >
                            Edit
                        </Button>
                        <Button className={"deleteButton"}
                                onClick={()=> deleteRow(record.id)}>
                            Delete
                        </Button>
                    </Space>
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
                //sortExpenses(data);
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

    const searchEntry = () => {

    };

    const deleteRow = async (id) => {
        console.log(`id for delete request ${id}`)
        await fetch(`/api/expense/${id}`, { method: 'DELETE' });
        getExpenses();
    }

    /*const returnExpenseIndex = (id) => {
        const index = expenses.findIndex((ex) => ex.id === id);
        return index;
    }*/

    const editRow = (id, newName, newAmount, newDate) => {
        //const index = returnExpenseIndex(id);
        //const index = expenses.findIndex((ex) => ex.id === id);
        //console.log(`index for of array ${index}`)
        //console.log(`id for put request ${id}`)
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
        ).then(() => {
            getExpenses();
        }).catch(err => {
            console.log('======failure=======')
            console.log(err)
        })
    }

    return (
        <>
            <InputComponent addExpense={addExpense}/>
            <SearchComponent searchEntry = {searchEntry}/>
            <Table className = "antDTable"
                   rowKey= "id"
                   dataSource={expenses}
                   columns = {columns}
                   bordered
            />
            <Modal
                open={isEditModalOpen}
                title="Edit Field"
                onOk={form.submit}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Space>
                        <FormItem name="name" type= "text" rules={[{ required: true, message: 'Please enter name' }]}>
                            <Input placeholder="Enter name"
                                   value={selectedRow?.name}/>
                        </FormItem>
                        <FormItem name="amount" type= "number" rules={[{ required: true, message: 'Please enter amount' }]}>
                            <Input placeholder="Enter amount"
                                   value={selectedRow?.amount}/>
                        </FormItem>
                        <FormItem name="date" type= "date"
                                  value={selectedRow?.create_date}
                                  rules={[{ required: true, message: 'Please enter date' }]}>
                            <DatePicker/>
                        </FormItem>
                    </Space>
                </Form>
            </Modal>
        </>
    );
}

export default TableComponent;