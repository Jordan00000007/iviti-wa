import React, { useState,useEffect,useImperativeHandle,forwardRef } from 'react';
import log from "../../utils/console";

// function ToggleButton({ onChange, status }) {
const ToggleButton = forwardRef((props, ref) => {

    const [isChecked, setIsChecked] = useState(props.status === "running" ? true : false);
    const [disabled, setDisabled] = useState(false);

    const handleCheckboxChange = (event) => {

       
        setDisabled(true);
        setIsChecked(event.target.checked);
        { props.onChange(event) };


    };

    useImperativeHandle(ref, () => ({
      
        getDisabled: () => {
            return disabled;
        },
       
    }));


    useEffect(() => {

        if (props.status==='running') setDisabled(false);
        if (props.status==='stop') setDisabled(false);
        if (props.status.indexOf('error')>=0) setDisabled(false);
        
    }, [props.status]);

    return (
        <label className="my-toggle-switch">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} disabled={disabled} />
            <span className="my-toggle-slider round"></span>
        </label>
    );
});

export default ToggleButton;
