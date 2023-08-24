import React, { useState, forwardRef, useEffect, useImperativeHandle} from "react";
import log from "../../utils/console";


const CustomInputMultiLine  = forwardRef((props, ref) => {

    const [inputValue, setInputValue] = useState(props.defaultValue);
    const [warnning, setWarnning] = useState(false);

    useImperativeHandle(ref, () => ({
      
        setInputValue: (myValue) => {
            setInputValue(myValue);
        },
        getInputValue: () => {
            return inputValue;
        },
        setWarnning:(myValue)=>{
            setWarnning(myValue);
        }
    }));

    useEffect(() => {
        
        setInputValue(props.defaultValue);

     }, [props.defaultValue]);

    return (
        <div>
            <textarea
                className={(warnning)?"form-control roboto-b1 my-text-input-warnning":"form-control roboto-b1 my-text-input"}
                value={inputValue} 
                onChange={(event)=>{
                    setInputValue(event.target.value);
                    props.onChange(event.target.value);
                }} 
                placeholder={props.placeholder}
                style={{width:parseInt(props.width),height:parseInt(props.height),resize:'none'}} 
                ref={ref}
                disabled={props.disabled}
                cols="40" 
                rows="3"
            >

            </textarea >
        </div>
    )
});

export default CustomInputMultiLine;