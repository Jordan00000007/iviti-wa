import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
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
import { useIsFocusVisible } from '@mui/material';



const CustomSelectLogic = forwardRef((props, ref) => {

    const theme1 = extendTheme({
        components: {
            JoySelect: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: '#979CB580',
                    }),
                },
            },

        },
    });

    const theme2 = extendTheme({
        components: {
            JoySelect: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: '#979CB5',
                    }),
                },
            },

        },
    });

    const theme3 = extendTheme({
        components: {
            JoySelect: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: '#B00020',
                    }),
                },
            },

        },
    });

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [selectedValue, setSelectedValue] = useState('');
    
    const [focus, setFocus] = useState(false);
    const [warnning, setWarnning] = useState(false);


    const handleSelectChange = (event, value) => {

        log(`${props.name} select change`);
        log(value)
        setSelectedValue(value);
        props.onChange(event, value);

    };

    const handleListBoxChange = (event) => {
        setFocus(event);
    };

    useImperativeHandle(ref, () => ({
        getSelectedValue: () => {
           
            return selectedValue;
        },
        setSelectedValue: (myValue) => {
          
            setSelectedValue(myValue);
        },
        setWarnning: (myValue) => {
            log('set logic warnning red box or not')
            log(myValue)
            setWarnning(myValue);
        },
    }));

    // useEffect(() => {

    //     if (props.defaultValue !== '') {
    //         setSelectedValue(props.defaultValue);
    //     }

    // }, [props]);



    return (

        <CssVarsProvider theme={warnning?theme3:(focus? theme2 : theme1)}>
            <Select
                indicator={<KeyboardArrowDown />}
                placeholder={placeHolder ? "--- please select ---" : ""}
                disabled={props.disabled}


                sx={{
                    width: parseInt(props.width),
                    fontSize: parseInt(props.fontSize),
                    fontFamily: 'roboto',
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
                        border: (warnning)?"1px solid #B00020":"1px solid #979CB5",
                        backgroundColor: "var(--base_2)",
                    },
                    '--Select-placeholderOpacity': 0.31,



                }}
                ref={ref}
                defaultValue={placeHolder ? "" : props.defaultValue}
                value={selectedValue}
                onChange={handleSelectChange}
                onListboxOpenChange={handleListBoxChange.bind(this)}

                slotProps={{
                    // root:{
                    //     sx: {
                    //         textOverflow: 'ellipsis',
                    //     }
                    // },

                    listbox: {
                        sx: {

                            top: '-4px !important',
                            backgroundColor: '#FAFAFD!important',
                            // '--List-padding': '0px',
                            maxHeight: parseInt(props.height) * 5,
                            
                            
                        },
                        placement: 'bottom-start',
                    },
                    button: {
                        sx: {
                            overflow:'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth:188,
                            display: 'inline-block',   
                            whiteSpace: 'nowrap',
                            textAlign:'left',
                            
                        },
                    },


                }}
            >

                {
                    (props.areaArr.length === 0) &&
                    <Option value={-1}
                        sx={{
                            fontSize: parseInt(props.fontSize),
                            fontFamily: 'roboto',
                            fontWeight: 400,
                            color: '#979CB599',
                            backgroundColor: '#FAFAFD!important',
                            minHeight: parseInt(props.height),
                        }}
                        disabled
                    >{(props.name === 'application') ? "please select model first" : "--- please select ---"}</Option>
                }


                {props.areaArr.map((item, index) => (

                    <Option value={item[0]} key={index} label={item[1]}
                        sx={{
                            fontSize: parseInt(props.fontSize),
                            fontFamily: 'roboto',
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

        </CssVarsProvider>
    );
});

export default CustomSelectLogic;