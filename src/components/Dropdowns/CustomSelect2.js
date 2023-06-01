import React from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import Select, { selectClasses } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { purple } from '@mui/material/colors';
import { Add, Delete, Edit, ExpandLess, ExpandMore } from '@mui/icons-material';





function CustomSelect2(props) {


    const handleSelectChange = (event, value) => {

        console.log(value);

    };

    return (


       <div>
        
        <Select style={{ width: '140px', height: '32px' }}
            sx={{
                '.MuiSelect-icon': {
                    color: 'red'
                },
               
            }}
        
            IconComponent={(_props) => (
                <div style={{ width:'5px',height:'5px',position: 'relative',top:'-9px', left:'-23px' }}>
                  <ExpandMore />
                </div>
              )}

            MenuProps={{
                // 點開的menu的底色, backgroundColor: Base 1,selected:divider
                PaperProps: {
                    sx: {
                        backgroundColor: '#FAFAFD',
                        "&& .Mui-selected": {
                            backgroundColor: "#E0E1E6  !important"
                        },
                        "&& .MuiMenuItem-root:hover": {
                            backgroundColor: "#E0E1E6"
                        },
                    },
                },
            }}
            indicator={<KeyboardArrowDown />}

            defaultValue={0}
            onChange={props.onChange}

            slotProps={{

                // listbox: {
                //     sx: {
                //         // fontSize: 15,
                //         // fontWeight: 400,
                //         fontFamily: 'Roboto',
                //         border: '1px solid red',
                //         "&:hover": {
                //             "&& fieldset": {
                //                 border: "1px solid green",
                //             },
                //         },


                //     }
                // },

                // listbox: {
                //     sx: {
                //       backgroundColor: '#FAFAFD',
                //       "&& .Mui-selected": {
                //         backgroundColor: "red  !important"
                //       },

                //       "&.Mui-selected": {
                //         backgroundColor: "red  !important"
                //     },
                //     },
                //   },

                // selectedItem: {
                //     sx:{
                //         backgroundColor: 'purple',
                //         color: 'white',
                //     }

                // },
            }}
        >
            {props.areaArr.map((item, index) => (
                <MenuItem value={index} key={index} className='roboto-b2'>
                    {item}
                </MenuItem>
            ))}
        </Select>

        </div>

    );
}

export default CustomSelect2;