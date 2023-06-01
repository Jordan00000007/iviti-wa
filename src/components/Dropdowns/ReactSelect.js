import React from 'react'
import Select from 'react-select'


function ReactSelect() {

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: 140, 
        
            fontSize:'15px',
            border: '1px solid #979CB580', // replace with your desired color
            borderRadius: 6,
          }),
        option: (provided) => ({
            ...provided,
            fontSize: '15px',
          
        }),
        singleValue: (provided, state) => ({
            ...provided,
            padding: '0px 0px',
          
          
        }),
       
    };

    const handleCheckboxChange = (event) => {

        console.log(`Toggle Button Changed :` + event.target.checked);

    };

    return (
        <Select options={options} styles={customStyles} components={{
            IndicatorSeparator: () => null
          }}/>
    );
}

export default ReactSelect;