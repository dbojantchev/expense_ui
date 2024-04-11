import React, {useState} from 'react'
import './styles.css';

function Index({id, name, amount, date, handleEdit, handleDelete}) {
    const [nameState, setName] = useState(name);
    const [amountState, setAmount] = useState(amount);
    const [dateState, setDate] = useState(new Date(date).toISOString().slice(0, 10));
    const [hasChanged, setHasChanged] = useState(false);

    return (
        <div className={"row"}>
            <div className={"cell"} >{id}</div>
            <div className={"cell"} > <input  name="name"
                                              value={nameState}
                                              type="text"
                                              onChange={(e) => {
                                                  setHasChanged(true);
                                                  setName(e.target.value);
                                              }}
                                              placeholder="Type name"/>
            </div>
            <div className={"cell"} > <input  name="amount"
                                              value={amountState}
                                              type="number"
                                              onChange={(e) => {
                                                  setHasChanged(true);
                                                  setAmount(e.target.value);
                                              }}
                                              placeholder="Type amount"/>
            </div>
            <div className={"cell"} > <input  name="date"
                                              value={dateState}
                                              type="date"
                                              onChange={(e) => {
                                                  setHasChanged(true);
                                                  setDate(e.target.value);
                                              }}
            />
            </div>

            <button className={"editButton"}
                    disabled={!hasChanged}
                    onClick={() => {handleEdit(id, nameState, amountState, dateState)}}>Edit</button>

            <button className={"deleteButton"}
                    onClick={() => {handleDelete(id)}}>Delete</button>
        </div>
    );
}

export default Index;