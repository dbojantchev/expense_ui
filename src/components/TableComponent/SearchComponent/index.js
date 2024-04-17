import React, { useEffect, useState } from 'react'
import {Form, InputNumber, Input, AutoComplete} from 'antd';
import './styles.css';

function SearchComponent({searchEntries}) {


    return (
        <>
            <div className={"search-group"}>
                <Input />
            </div>
        </>
    );
}

export default SearchComponent;