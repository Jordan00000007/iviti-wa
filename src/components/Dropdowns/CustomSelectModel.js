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
import LabelButton from '../../components/Buttons/LabelButton';
import { useDispatch } from "react-redux";
import DeleteIcon from '../../components/Icons/DeleteIcon';









const CustomSelect = forwardRef((props, ref) => {

    const dispatch = useDispatch();

    const theme1 = extendTheme({
        components: {
            JoySelect: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: '#979CB580',
                    }),
                },
            },
            JoyChip: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        ...(ownerState.color === 'ivit' && {
                            color: '#FFFFFF',
                            backgroundColor: '#E61F23',
                        }),
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
            JoyChip: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        ...(ownerState.color === 'ivit' && {
                            color: '#FFFFFF',
                            backgroundColor: '#E61F23',
                        }),
                    }),
                },
            },
           
        },
    });

    const theme = extendTheme({
        components: {
            JoyButton: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        ...(ownerState.color === 'ivit' && {
                            color: 'red',
                            backgroundColor: 'green',
                        }),
                    }),
                },
            },
            JoyChip: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        ...(ownerState.color === 'ivit' && {
                            color: '#FFFFFF',
                            backgroundColor: '#E61F23',
                        }),
                    }),
                },
            },
        },
    });

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [selectedValue, setSelectedValue] = useState('');
    const [focus, setFocus] = useState(false);

    const handleListBoxChange= (event, value) => {

        log('list box changed '+event)
        setFocus(event);
       

    };


    const handleSelectChange = (event, value) => {

        if (value === -2) {
            // import modal
         
            props.importModel();

        } else {
            setSelectedValue(value);
            props.onChange(event, value);
        }

    };

    const handleModelDelete= (value) => {

        props.modelDelete(value);
    }
 

 

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
        <CssVarsProvider theme={focus?theme2:theme1}>
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
                defaultValue={placeHolder ? "" : props.defaultValue}
                value={selectedValue}
                onChange={handleSelectChange}
                onListboxOpenChange={handleListBoxChange.bind(this)}
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
                            color: '#16272E',
                            backgroundColor: '#FAFAFD!important',
                            minHeight: parseInt(props.height),
                        }}
                    >--- please select ---</Option>
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

                        {
                            ((item[1]!=='yolo-v3-tf')&&(item[1]!=='resnet-v1'))&&
                            <Chip
                                size="sm"
                                variant="outlined"
                            
                                sx={{
                                ml: "auto",
                                borderRadius: "50px",
                                minHeight: "20px",
                                paddingInline: "0px",
                                fontSize: "xs",
                                border:"0px",
                                }}
                            >
                                <DeleteIcon onClick={handleModelDelete.bind(this,{"uid":item[0],"name":item[1]})}></DeleteIcon>
                            </Chip>

                        }

                       
                    </Option>


                ))}

                <ListDivider key="divider" inset="gutter"/>
                <Option
                    value={-2}
                    key="import"
                    sx={{
                        fontSize: parseInt(props.fontSize),
                        fontWeight: 400,
                        color: '#16272E',
                        backgroundColor: '#FAFAFD!important',
                        minHeight: parseInt(props.height),
                        justifyContent: 'center'
                    }}
                >
                    <ListItemDecorator>

                        <Chip
                            size="sm"
                            color="ivit"
                            sx={{
                                ml: 'auto',
                                borderRadius: '6px',
                                minHeight: '32px',
                                paddingInline: '14px',
                                fontSize: 16,
                                justifyContent: 'center'
                                
                            }}
                        >
                            Import Model
                        </Chip>
                        
                    </ListItemDecorator>

                </Option>


            </Select>
            
        </CssVarsProvider>

    );
});

export default CustomSelect;