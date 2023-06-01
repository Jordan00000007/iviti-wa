import React, { useState, useEffect, forwardRef } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Chip from "@mui/joy/Chip";

import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import { ReactComponent as Icon_Edit } from '../../assets/Icon_Edit.svg';
import EditIcon from '../../components/Icons/EditIcon';



const CustomSelectArea = forwardRef((props, ref) => {

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [selectedValue, setSelectedValue] = useState(props.defaultValue);
    const [isHovered,setIsHovered]= useState(false);

    //defaultValue

    const handleSelectChange = (event, value) => {

        log('select change');

    };

    const handleAreaRename= (idx) => {

        log('handle area rename inside');
        log(idx)
        props.areaRename(idx)

    };

    useEffect(() => {

        if (props.defaultValue !== '')
            setSelectedValue(props.defaultValue)

    }, [props.defaultValue]);


    const handleMouseEnter=()=>{
        //setIsHovered(true);
        this.setState({ isHovered: true })
    }

    const handleMouseLeave=()=>{
        //setIsHovered(false);
        this.setState({ isHovered: false })
    }

    return (

        <Select
            indicator={<KeyboardArrowDown />}
            placeholder={placeHolder ? "--- please select ---" : ""}
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
            // defaultValue={placeHolder?"":0}
            value={props.defaultValue}
            onChange={props.onChange}
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
                        {/* <ListItemDecorator> */}
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
                            <EditIcon onClick={handleAreaRename.bind(this, item[0])}></EditIcon>
                        </Chip>
                        {/* </ListItemDecorator> */}
                    
                </Option>
            ))}
        </Select>


    );
});

export default CustomSelectArea;