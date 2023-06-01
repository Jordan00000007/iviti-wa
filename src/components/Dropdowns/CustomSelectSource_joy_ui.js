import React,{useState} from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import LabelButton from '../../components/Buttons/LabelButton';
import SourcePanel from '../../components/Panel/SourcePanel';



function CustomSelectSource(props) {

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    
    const handleSelectChange = (event, value) => {

        log('select change');

    };

    const handleChange = (event, value) => {

        log(event);

    };

    const handleClick = (event, value) => {

        log(event);

    };

    const handleListBoxOpenChange = (event, value) => {

        log('handle List Box Open Change');
        //event.stopPropagation();
        log(event)
        
    };

    return (
            <div>
            <Select
                indicator={<KeyboardArrowDown />}
                placeholder	= {placeHolder?"--- please select ---":""}
                
                renderValue={(selected) => (
                //    <LabelButton name='test' widht="100" height="20"/>
                    selected.value
                )}
                multiple="multiple"
                sx={{
                    width: parseInt(props.width),
                    fontSize: parseInt(props.fontSize),
                    fontWeight: 400,
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

                defaultValue={placeHolder?"":0}
                onChange={handleChange}
                onClick={handleClick}
                onListboxOpenChange={props.onListboxOpenChange}

                slotProps={{
                    listbox: {
                        sx: {
                            top: '-4px !important',
                            left: '130px !important',
                            backgroundColor:'#FAFAFD!important',
                            zIndex:3,
                            
                        },
                    },
                }}
            >
                    <Option value={0}
                        sx={{
                            fontSize: parseInt(props.fontSize),
                            fontWeight: 400,
                            color: '#16272E',
                            backgroundColor:'#FAFAFD!important',
                            minHeight:260,
                            minWidth:500,
                           
                        }}
                        
                        >
                        
                        {/* <form class="px-4 py-3">
                        <div class="mb-3">
                        <label for="exampleDropdownFormEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
                        </div>
                        <div class="mb-3">
                        <label for="exampleDropdownFormPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
                        </div>
                        <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="dropdownCheck" />
                            <label class="form-check-label" for="dropdownCheck">
                            Remember me
                            </label>
                        </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Sign in</button>
                    </form> */}
                    </Option>
            
            </Select>
           
            </div>
      
    );
}

export default CustomSelectSource;