import React, {useState} from 'react'
import './styles.css';
import { Button, Input } from 'antd';

function Index({id, name, amount, date, handleEdit, handleDelete}) {
    const [nameState, setName] = useState(name);
    const [amountState, setAmount] = useState(amount);
    const [dateState, setDate] = useState(new Date(date).toISOString().slice(0, 10));
    const [hasChanged, setHasChanged] = useState(false);

    return (
        <div className={"row"}>
            <div className={"cell"} >{id}</div>
            <div className={"cell"} > <Input  name="name"
                                              value={nameState}
                                              type="text"
                                              onChange={(e) => {
                                                  setHasChanged(true);
                                                  setName(e.target.value);
                                              }}
                                              placeholder="Type name"/>
            </div>
            <div className={"cell"} > <Input  name="amount"
                                              value={amountState}
                                              type="number"
                                              onChange={(e) => {
                                                  setHasChanged(true);
                                                  setAmount(e.target.value);
                                              }}
                                              placeholder="Type amount"/>
            </div>
            <div className={"cell"} > <Input  name="date"
                                              value={dateState}
                                              type="date"
                                              onChange={(e) => {
                                                  setHasChanged(true);
                                                  setDate(e.target.value);
                                              }}
            />
            </div>

            <Button className={"editButton"}
                    disabled={!hasChanged}
                    onClick={() => {handleEdit(id, nameState, amountState, dateState)}}>Edit</Button>

            <Button className={"deleteButton"}
                    onClick={() => {handleDelete(id)}}>Delete</Button>
        </div>
    );
}

export default Index;