import React, { useState,useEffect,useRef } from 'react';
import { Tooltip } from 'react-tooltip';

function TaskCardModelName(props) {

    const [showTooltip, setShowTooltip] = useState(false);
    
    const myRef = useRef(null);

    useEffect(() => {
       
        const obj=myRef.current
        if (obj.scrollHeight > obj.clientHeight || obj.scrollWidth > obj.clientWidth){
            setShowTooltip(true);
        }
       
    }, [showTooltip]);

        return(
            <div className="my-card-model roboto-b2 text-truncate my-tooltip-container" style={{paddingLeft:'2px',width:'160px'}} data-tooltip-id={showTooltip?"tooltip-model-name":""} data-tooltip-content={showTooltip?props.nameModel:""} ref={myRef}>
                {props.nameModel}
                {showTooltip && <Tooltip id="tooltip-model-name" className="my-tooltip" />}
            </div>
        )
      
    

}

export default TaskCardModelName;