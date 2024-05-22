import React, {useEffect, useState} from "react";
import {Button, Input, Modal} from "antd";

function ModalComponent({isEditModalOpen, handleEdit, selectedRow, handleCancel}) {
    const [nameState, setName] = useState(selectedRow?.name);
    const [amountState, setAmount] = useState(selectedRow?.amount);
    const [dateState, setDate] = useState(selectedRow?.create_date);

    useEffect(() => {
        if(isEditModalOpen){
            setName(selectedRow?.name);
            setAmount(selectedRow?.amount);
            setDate(selectedRow?.create_date);
        }
    }, [isEditModalOpen])

    return (
        <div>
            <Modal
                open={isEditModalOpen}
                title="Edit Field"
                onOk={() => {handleEdit(selectedRow?.id, nameState, amountState,  dateState)}}
                onCancel={handleCancel}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                )}
            >
                <div className={'input-group'}>
                    <label>Name</label>
                    <Input type= "text"
                           placeholder="Enter name"
                           value={nameState}
                           onChange={(e) => {
                               setName(e.target.value);
                           }}/>
                    <label>Amount</label>
                    <Input type="number"
                           placeholder="Enter amount"
                           value={amountState}
                           onChange={(e) => {
                               setAmount(e.target.value);
                           }}/>
                    <label>Date</label>
                    <Input type="date"
                           placeholder="Enter date"
                           value={dateState}
                           onChange={(e) => {
                               setDate(e.target.value);
                           }}/>
                </div>
            </Modal>
        </div>
    );
}

export default ModalComponent;