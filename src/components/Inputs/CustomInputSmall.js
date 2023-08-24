import React, { useState, forwardRef, useEffect} from "react";
import log from "../../utils/console";


const CustomInputSmall  = forwardRef((props, ref) => {

    const [inputValue, setInputValue] = useState(props.defaultValue);

    useEffect(() => {
        
        setInputValue(props.defaultValue);

     }, [props.defaultValue]);

    return (
        <div>
            <input type="text" 
                className="form-control roboto-b1 my-text-input-small" 
                value={inputValue} 
                onChange={(event)=>{
                    setInputValue(event.target.value);
                    props.onChange(event.target.value);
                }} 
                placeholder={props.placeholder}
                style={{width:parseInt(props.width),height:parseInt(props.height)}} 
                ref={ref}
                disabled={props.disabled}
            >

            </input>
        </div>
    )
});

export default CustomInputSmall;