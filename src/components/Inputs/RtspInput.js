import React, { useState} from 'react';
import log from "../../utils/console";


const RtspInput = (props) => {

    const [inputValue, setInputValue] = useState(props.defaultValue);

    const handleInputChange=(event)=>{
        setInputValue(event.target.value)
        props.onChange(event);
    }

    return (
        <div>
            <div className='input-group my-source-input-group'>
                <span className="input-group-text my-source-input-tag" id="basic-addon1">rtsp://</span>
                <input className="form-control my-source-input-text" type="text" value={inputValue} onChange={handleInputChange}></input>
                
            </div>
        </div>
    )
}

export default RtspInput;