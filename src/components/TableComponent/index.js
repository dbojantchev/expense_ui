import React, { useEffect, useState } from 'react'
import {InputNumber, Input, Button, Modal, Table, Space, Dropdown} from 'antd';
import './styles.css';
import InputComponent from './InputComponent'
import SearchComponent from './SearchComponent'
import ModalComponent from "./ModalComponent";
//import Row from './Row/index'


function TableComponent() {
    const PAGE_SIZE=5;
    //initial expense array of  objects is empty, denoted by []
    const [expenses, setExpenses] = useState([]);
    //const isEditing = (record) => record.key === editingKey;
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    //const [searchVal, setSearchVal] = useState('NOSEARCH');
    const [searchVal, setSearchVal] = useState('');//UNDEFINED INITIAL SEARCH VALUE

    const noSearch =  'NOSEARCH';
    const [suggestions, setSuggestions] = useState([]);
    const [sortCol, setSortCol] = useState('id');
    const [sortDir, setSortDir] = useState('desc');
    //const [pageNum, setPageNum] = useState(1);
    //const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        columnKey: 'id',
        order: 'descend',
    });

    //hook below used to update the database
    useEffect(() => {
        console.log(`UseEffect TableParam sort order ${tableParams.order} column key ${tableParams.columnKey}`);
        console.log(`get at TableComponent useEffect`);
        //getExpenses(noSearch);
        getExpenses(searchVal);

    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize, tableParams.order/*, sortCol, sortDir*/])

    const onEditRow = (record) => {
        console.log(`show modal from  id ${record.id}`);
        setSelectedRow(record);
        setIsEditModalOpen(true);
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
    };

    const columns = [{
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
    }, {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,

    }, {
            title: 'amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => a.amount - b.amount,
    },{
            title: 'create_date',
            dataIndex: 'create_date',
            key: 'create_date',
            sorter: true,
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

    const handleTableChange = (pagination, filters, sorter) => {
        //console.log(`handleTabChange TableParam sort order ${tableParams.order} column key ${tableParams.columnKey}`);
        console.log(`1 DIR ${sortDir} SORT.ORDER ${sorter.order}`);
        //setSortCol(sorter.columnKey);
        //sorter.order = 'ascend' ? 'descend' : 'ascend';
        //console.log(`2 DIR ${sortDir} SORT.ORDER ${sorter.order}`);
        //setSortDir(sorter.order === 'ascend' ? 'asc' : 'desc');
        console.log(`3 DIR ${sortDir} SORT.ORDER ${sorter.order}`);
        if(sorter.order === undefined || sorter.columnKey === undefined){//if sorter is undefined because just pagination has been called
            sorter.columnKey = tableParams.columnKey
            sorter.order = tableParams.order;
            setTableParams({
                pagination,
                ...sorter,
            });
        }else{
            setTableParams({
                pagination,
                ...sorter,
            });
        }
    }

    //get request for getting entire table
    const getExpenses = (searchName) => {
        setSearchVal(searchName);
        setLoading(true);
        console.log(`get search name ${searchName}`);
        fetch(
            `/api/expense?q=proxy&searchVal=${searchName}&sortCol=${tableParams.columnKey}&sortDir=${tableParams.order}&pageNum=${tableParams.pagination?.current}&pageSize=${tableParams.pagination?.pageSize}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then(resp => {
            resp.json().then((data) => {
                //console.log(`DATA`);
                //console.log(data.rows);
                //console.log(` count ${data.totalCount}`);

                data.rows.forEach((entry) => {
                    entry.create_date = new Date(entry.create_date).toISOString().slice(0, 10);
                });
                setExpenses(data.rows);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: data.totalCount,
                    },
                });
            });
        })
            .catch(err => {
                console.log('======failure=======');
                console.log(err);
            });
    }

    //get request for search suggestions
    /*const searchEntry = (searchName) => {
        console.log(`search name ${searchName}`);
        //setSearchVal(searchName);
        //console.log(`search term ${searchVal}`);

        fetch(
            `/api/expense?q=proxy&searchVal=${searchName}&sortCol=${sortCol}&sortDir=${sortDir}&pageNum=${tableParams.pagination?.current}&pageSize=${tableParams.pagination?.pageSize}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(resp => {
                resp.json().then((data) => {
                    //console.log(`search data results ${data}`);
                    setSuggestions(data);
                });
            })
            .catch(err => {
                console.log('======failure=======');
                console.log(err);
            });
    };*/

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
                getExpenses(noSearch);
            }
        ).catch(err => {
                    console.log('======failure=======')
                    console.log(err)
        })
    };

    const deleteRow = async (id) => {
        console.log(`id for delete request ${id}`)
        await fetch(`/api/expense/${id}`, { method: 'DELETE' });
        getExpenses(noSearch);
    }

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
            getExpenses(noSearch);
        }).catch(err => {
            console.log('======failure=======')
            console.log(err)
        })
        handleCancel();
    }

    return (
        <>  <div className= "input-search-group">
                <InputComponent classname="Input" addExpense={addExpense}/>
                <SearchComponent classname="Search" //searchEntry = {searchEntry}
                    suggestions = {suggestions}
                    getExpenses = {getExpenses}
                />
            </div>
            <Table className = "antDTable"
                   rowKey= "id"
                   dataSource={expenses}
                   columns = {columns}
                   bordered
                   pagination={tableParams.pagination}
                   loading={loading}
                   onChange={handleTableChange}

            />
            <ModalComponent
                isEditModalOpen={isEditModalOpen}
                handleEdit={editRow}
                selectedRow={selectedRow}
                handleCancel={handleCancel}
            />
        </>
    );
}

export default TableComponent;