import React, { useState, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import CustomTooltip from '../../components/Tooltips/CustomTooltip';

const LabelButton = (props) => {

    const [showTooltip, setShowTooltip] = useState(false);

    const myRef = useRef(null);

    useEffect(() => {

        // if(myRef!==null){
        //     const obj = myRef.current;

        //     if (obj.scrollHeight > obj.clientHeight || obj.scrollWidth > obj.clientWidth) {
        //         setShowTooltip(true);
        //     }
        // }



    }, [showTooltip]);


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
           
                <button className='my-label-button-list roboto-b1' >
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

    return (

        <button className={props.className} style={{width:parseInt(props.width),height:parseInt(props.height)}} onClick={props.onClick}>
            <CustomTooltip>{props.name}</CustomTooltip>
        </button>


    );



};

export default LabelButton;