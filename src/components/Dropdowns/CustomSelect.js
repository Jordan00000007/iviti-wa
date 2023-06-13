import React, { useState, useEffect, forwardRef,useImperativeHandle,useRef } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import { ReactComponent as Icon_Edit } from '../../assets/Icon_Edit.svg';
import ListDivider from '@mui/joy/ListDivider';



const CustomSelect = forwardRef((props, ref) => {

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [selectedValue, setSelectedValue] = useState('');

  
    const handleSelectChange = (event, value) => {

        // log(`${props.name} select change`);
        // log(value)
        setSelectedValue(value);
        props.onChange(event,value);

    };

    useImperativeHandle(ref, () => ({
        getSelectedValue: () => {
            // log(`${props.name} get selected value`)
            return selectedValue;
        },
        setSelectedValue: (myValue) => {
            // log(`${props.name} set selected value`)
            // log(myValue)
            setSelectedValue(myValue);
           
        }
    }));


    return (

        <Select
            indicator={<KeyboardArrowDown />}
            placeholder={placeHolder ? "--- please select ---" : ""}
            disabled={props.disabled}
            sx={{
                width: parseInt(props.width),
                fontSize: parseInt(props.fontSize),
                fontWeight: 400,
                color: '#16272E',
                fontFamily: 'Roboto',
                margin: 0,
                paddingleft: 5,
                minHeight: parseInt(props.height),
                borderRadius: 6,
                [`& .${selectClasses.indicator}`]: {
                    transition: '0.2s',
                    [`&.${selectClasses.expanded}`]: {
                        transform: 'rotate(-180deg)',
                    },
                },
                "&:hover": {
                    border: "1px solid #979CB5",
                    backgroundColor: "var(--base_2)",
                },

            }}
            ref={ref}
            defaultValue={placeHolder?"":props.defaultValue}
            value={selectedValue}
            onChange={handleSelectChange}
            slotProps={{

                listbox: {
                    sx: {

                        top: '-4px !important',
                        backgroundColor: '#FAFAFD!important',
                        // '--List-padding': '0px',
                        maxHeight: parseInt(props.height) * 5,

                    },
                },


            }}
        >

            {
                (props.areaArr.length === 0) &&
                <Option value={-1}
                    sx={{
                        fontSize: parseInt(props.fontSize),
                        fontWeight: 400,
                        color: '#979CB599',
                        backgroundColor: '#FAFAFD!important',
                        minHeight: parseInt(props.height),
                    }}
                    disabled
                >{(props.name==='application')?"please select model first":"--- please select ---"}</Option>
            }


            {props.areaArr.map((item, index) => (
                
                <Option value={item[0]} key={index} label={item[1]}
                    sx={{
                        fontSize: parseInt(props.fontSize),
                        fontWeight: 400,
                        color: '#16272E',
                        backgroundColor: '#FAFAFD!important',
                        minHeight: parseInt(props.height),
                    }}

                >  
                {item[1]}     
                </Option>
               
            ))}
        </Select>


    );
});

export default CustomSelect;