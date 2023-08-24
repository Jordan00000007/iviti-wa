import React,{useEffect,forwardRef,useImperativeHandle} from 'react';
import log from "../../utils/console";

import styled from 'styled-components';

const Button = styled.div`
    background-color: ${(props)=>{return (props.selected)?'#16272E0F':'white'}};
    color: ${(props)=>{return (props.selected)?'#16272E':'#16272E52'}};
    font-size: 18px;
    width:144px;
    height:36px;
    padding: 5px 6px;
    border-top: 1px solid #16272ED9;
    border-bottom: 1px solid #16272ED9;
    border-left: 1px solid #16272ED9;
    border-right: ${(props)=>{return (props.position==='L')?'0px':'1px solid #16272ED9'}};
    border-radius: ${(props)=>{return (props.position==='L')?'6px 0px 0px 6px':'0px 6px 6px 0px'}};
    cursor:pointer;
    text-align:center;
    ${(props)=>{return (!props.selected)?`
        &:hover {
            color: #16272E;
            background-color: #16272E03;
        }
    `:''}}
    `;

const TogglePanel = forwardRef((props, ref) => {

      
    const { _togglePanelRef, _togglePanelApplicationRef, _togglePanelEventRef } = ref;

    const [value, setValue] = React.useState('Application');

    const handleApplicationClick=(event)=>{  
        setValue('Application');
        props.onToggle('Application');
    }

    const handleEventClick=(event)=>{
        setValue('Event')
        props.onToggle('Event');
    }

    useImperativeHandle(_togglePanelRef, () => ({
        
        setToggleApplication:()=>{
            _togglePanelApplicationRef.current.click();
        },
        setToggleEvent:()=>{
            _togglePanelEventRef.current.click();
        },
      
     
    }));

    return (
        <div className="d-flex align-items-center">
            <Button selected={(value==='Application')?true:false} position='L' onClick={handleApplicationClick} ref={_togglePanelApplicationRef}>Application</Button>
            <Button selected={(value==='Event')?true:false} position='R' onClick={handleEventClick} ref={_togglePanelEventRef}>Event</Button>
        </div>
    )


});

export default TogglePanel;