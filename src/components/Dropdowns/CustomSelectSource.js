import React, { useState, useEffect,useRef,useImperativeHandle,forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
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

    const uploadStatus = useSelector((state) => state.sources.uploadStatus);

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
        if (uploadStatus!=='loading'){
            expandSourceMenu?setExpandSourceMenu(false):setExpandSourceMenu(true);
            props.onListboxOpenChange(expandSourceMenu);
        }
    };

    const handleInputClick=()=>{
        buttonRef.current.click();
    }

    useEffect(() => {
      
    }, [expandSourceMenu]);

    useImperativeHandle(ref, () => ({
        setButtonClick: () => {
            buttonRef.current.click();
        }
    }));



    return (
        
        <div style={{width:240,height:52}}>
            <style>
                {`
                .my-input-group { 
                    position: relative; 
                    height: 32px;
                }
                
                .my-source-input { 
                    display: block; 
                    background: #fff; 
                    padding: 10px 40px 10px 10px; 
                    width: 240px; 
                    height: 52px;
                    border: 1px solid ${(props.sourceMenu)?'var(--on_color_2)':'var(--on_color_2_t1)'};
                    border-radius: 6px !important;
                   
                  
                }
                .my-source-input-warnning { 
                    border: 1px solid #B00020;   
                    height: 52px;
                    background: #fff!important; 
                    
                }
                .my-source-input:hover { 
                    border: 1px solid var(--on_color_2);   
                    
                }
                .my-source-input:focus { 
                    border: 1px solid var(--on_color_2)!important;  
                    -webkit-box-shadow: none!important;
                    -moz-box-shadow: none!important;
                    box-shadow: none!important;
                 
                }
                .my-source-input-button { 
                    color: var(--on_color_2);
                    position: absolute; 
                    display: block; 
                    left: 198px; 
                    top: 3px; 
                    height: 46px;
                    width: 30x;
                    z-index: 9; 
                    border:1px solid white!important;
                    background: white;
                  
                }
              

             
                `}
            </style>
            <div className="my-input-group" onClick={handleSourceMenuClick} >
                <input type="text" className={(props.disabled)?"form-control my-source-disable": (props.warnning)?"form-control my-source-input-warnning":"form-control my-source-input"} aria-label="Text input with dropdown button" placeholder='--- please select ---' readOnly="readonly"  value={props.name} style={{cursor:'pointer'}} onClick={handleInputClick}/>
                <button className="btn dropdown-toggle my-source-input-button" type="button" aria-expanded="false" 
                disabled={props.disabled}
                onClick={handleSourceMenuClick}
                ref={buttonRef}
                >
                  
                    {
                        expandSourceMenu && <FontAwesomeIcon icon={faChevronDown} className="my-chevron-icon" transform="shrink-3"/>
                    }
                    {
                        (!expandSourceMenu) && <FontAwesomeIcon icon={faChevronUp} className="my-chevron-icon" transform="shrink-3" />
                    }

                </button>
                
            </div>
        </div>
        
    );
});

export default CustomSelectSource;