import React, { useState, useEffect, useRef,forwardRef,useImperativeHandle } from 'react';
import { Tooltip } from 'react-tooltip';
import CustomTooltip from '../../components/Tooltips/CustomTooltip';

const LabelButton= forwardRef((props, ref) => {

    const [showTooltip, setShowTooltip] = useState(false);

    const buttonRef = useRef(null);


    useImperativeHandle(ref, () => ({
        setButtonClick: () => {
            buttonRef.current.click();
        }
    }));


    if (props.type === "expand") {
        return (
            <button className='my-label-button-expand' onClick={props.onClick} >
                {props.name}
            </button>
        )
    }

    if (props.type === "close") {
        return (
            <button className='my-label-button-close roboto-b1' onClick={props.onClick}>
                {props.name}
            </button>
        )
    }

    if (props.type === "list") {
        return (
           
            <button className='my-label-button-list roboto-b1' >
                {props.name}
            </button>

        )
    }

    if (props.type === "truncate") {
        return (
           
            <button className='my-label-button-truncate roboto-b1' style={{width:80,height:28}} >
                <CustomTooltip>{props.name}</CustomTooltip>
            </button>

        )
    }

    if (props.type === "line") {
        return (
           
            <button className='my-label-button-line roboto-b1' onClick={props.onClick} style={{width:parseInt(props.width),height:parseInt(props.height)}}>
                {props.name}
            </button>

        )
    }

    if (props.type === "select") {
        return (
           
            <button className='my-label-button-select roboto-b1' onClick={props.onClick} style={{height:parseInt(props.height)}}>
                &nbsp;&nbsp;{props.name}&nbsp;&nbsp;
            </button>

        )
    }

    return (

        <button className={props.className} style={{width:parseInt(props.width),height:parseInt(props.height)}} onClick={props.onClick} ref={buttonRef}>
            <CustomTooltip>{props.name}</CustomTooltip>
        </button>


    );



});

export default LabelButton;