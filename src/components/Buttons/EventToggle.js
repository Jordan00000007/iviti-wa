import React, { useState,useEffect,useImperativeHandle,forwardRef } from 'react';
import log from "../../utils/console";

// function ToggleButton({ onChange, status }) {
const EventToggle = forwardRef((props, ref) => {

    const [isChecked, setIsChecked] = useState(props.status === "run" ? true : false);
   
    const handleCheckboxChange = (event) => {

       
      
        setIsChecked(event.target.checked);
        { props.onChange(event,event.target.checked) };


    };

    useImperativeHandle(ref, () => ({
      
        setChecked: (myValue) => {
            setIsChecked(myValue);
        }
       
    }));


    useEffect(() => {

     
        
    }, [props.status]);

    return (
        <label className="my-toggle-switch">
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <span className="my-toggle-slider round"></span>
        </label>
    );
});

export default EventToggle;
