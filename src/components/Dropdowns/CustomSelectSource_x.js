import React, { useState, useEffect } from 'react'
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import log from "../../utils/console";
import LabelButton from '../../components/Buttons/LabelButton';
import SourcePanel from '../../components/Panel/SourcePanel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';



function CustomSelectSource(props) {

    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [expandSourceMenu, setExpandSourceMenu] = useState(true);

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

    //handleSourceMenuClick

    const handleSourceMenuClick = (event, value) => {

        expandSourceMenu?setExpandSourceMenu(false):setExpandSourceMenu(true);
    };

    useEffect(() => {
      
    }, [expandSourceMenu]);


    return (
        <div style={{width:'240px'}}>
        <div style={{position:'absolute'}}>
            <div class="input-group" style={{position:'relative'}}>
                <input type="text" class="form-control my-source-input" aria-label="Text input with dropdown button" placeholder='--- please select ---' disabled style={{ width: '200px', height: '52px' }} />
                <button class="btn dropdown-toggle" type="button" aria-expanded="false" style={{
                    borderLeft: '2px solid white',
                    borderTop: '1px solid #979CB580',
                    borderRight: '1px solid #979CB580',
                    borderBottom: '1px solid #979CB580',
                    width: '40px',
                }}
                onClick={handleSourceMenuClick}
                >
                  
                    {
                        expandSourceMenu && <FontAwesomeIcon icon={faChevronDown} className="my-chevron-icon" />
                    }
                    {
                        (!expandSourceMenu) && <FontAwesomeIcon icon={faChevronUp} className="my-chevron-icon" />
                    }




                </button>

                
            </div>
            {
                    (!expandSourceMenu)&&<SourcePanel  style={{position:'relative'}}/>
                }
        </div>
        </div>
    );
}

export default CustomSelectSource;