import React, { useState, useEffect,useRef,useImperativeHandle,forwardRef } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import LabelButton from '../../components/Buttons/LabelButton';
import SourcePanel from '../../components/Panel/SourcePanel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';



const CustomSelectSource = forwardRef((props, ref) => {


    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [expandSourceMenu, setExpandSourceMenu] = useState(true);

    const buttonRef = useRef(null);
   

    const handleSelectChange = (event, value) => {

        log('select change');

    };

    const handleChange = (event, value) => {

        log(event);

    };

    const handleClick = (event, value) => {

        log(event);

    };

    //handleSourceMenuClick

    const handleSourceMenuClick = (event, value) => {

        expandSourceMenu?setExpandSourceMenu(false):setExpandSourceMenu(true);
        props.onListboxOpenChange(expandSourceMenu);
        log('set source menu click')
    };

    useEffect(() => {
      
    }, [expandSourceMenu]);

    useImperativeHandle(ref, () => ({
        setButtonClick: () => {
            buttonRef.current.click();
        }
    }));



    return (
        
        <div>
            <div className="input-group">
                <input type="text" className={(props.disabled)?"form-control my-source-disable":"form-control my-source-input"} aria-label="Text input with dropdown button" placeholder='--- please select ---' disabled style={{ width: '200px', height: '52px' }} value={props.name}/>
                <button className="btn dropdown-toggle my-source-input-button" type="button" aria-expanded="false" style={{
                    borderLeft: '2px solid white',
                    borderTop: '1px solid #979CB580',
                    borderRight: '1px solid #979CB580',
                    borderBottom: '1px solid #979CB580',
                    width: '40px',
                }}
                disabled={props.disabled}
                onClick={handleSourceMenuClick}
                ref={buttonRef}
                >
                  
                    {
                        expandSourceMenu && <FontAwesomeIcon icon={faChevronDown} className="my-chevron-icon" />
                    }
                    {
                        (!expandSourceMenu) && <FontAwesomeIcon icon={faChevronUp} className="my-chevron-icon" />
                    }

                </button>
            </div>
        </div>
        
    );
});

export default CustomSelectSource;