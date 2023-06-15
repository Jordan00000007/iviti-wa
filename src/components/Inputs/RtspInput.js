import React, { useState } from 'react';
import log from "../../utils/console";


const RtspInput = (props) => {

    const [inputValue, setInputValue] = useState(props.defaultValue);

    const handleInputChange = (event) => {
        setInputValue(event.target.value)
        props.onChange(event);
    }

    return (

        <>
            <style>
                {`
                .input-box { 
                    position: relative; 
                    height: 32px;
                }
                
                .my-rtsp-input { 
                    display: block; 
                    background: #fff; 
                    padding: 10px 10px 10px 58px; 
                    width: 300px; 
                    height: 33px;
                    border: 1px solid var(--on_color_2_t1);
                    border-radius: 6px !important;
                  
                }
                .my-rtsp-input:hover { 
                    border: 1px solid var(--on_color_2);   
                }
                .my-rtsp-input:focus { 
                    border: 1px solid var(--on_color_2)!important;  
                    -webkit-box-shadow: none!important;
                    -moz-box-shadow: none!important;
                    box-shadow: none!important;
                 
                }
                .my-prefix { 
                    color: var(--on_color_2);
                    position: absolute; 
                    display: block; 
                    left: 14px; 
                    top: 5px; 
                    z-index: 9; 
                }

             
                `}
            </style>
            <div>
                
                <div className="input-box">
                    <input className="form-control my-rtsp-input" type="text" onChange={handleInputChange} value={inputValue} />
                    <span className="my-prefix">rtsp://</span>
                </div>
            </div>
        </>
    )
}

export default RtspInput;