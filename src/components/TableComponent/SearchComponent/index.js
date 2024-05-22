import React, { useEffect, useState } from 'react'
import {Input, AutoComplete, Dropdown} from 'antd';
import './styles.css';

function SearchComponent({searchEntry, suggestions, getExpenses}) {
    const [searchName, setSearchName] = useState('MOUNT');

    useEffect(() => {
        if(searchName.length > 1 && searchName != 'MOUNT'){
            console.log(`search name ${searchName}`);
            //searchEntry(searchName);
            getExpenses(searchName);
        }
        else if(searchName.length == 0){
            console.log(`search all ${searchName}`);
            getExpenses(searchName);
        }
    }, [searchName])

    return (
        <>
            <div className={"search-group"}>
                <AutoComplete
                    className = {"auto-complete"}
                    options={suggestions.map((suggestion) => ({
                        value: suggestion.name, // Adjust this based on your suggestion data structure
                    }))}
                    //onSelect={(value, option) => {getExpenses(option.suggestion.name)}}
                >
                <Input id="search" placeholder="Search by name"
                        value={searchName}
                        onChange={(e) => {
                            setSearchName(e.target.value);
                        }}
                />
                </AutoComplete>
            </div>
        </>
    );
}

export default SearchComponent;