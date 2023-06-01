import React, { useState,useEffect,useRef } from 'react';
import { Tooltip } from 'react-tooltip';

function TaskCardApplicationName(props) {

    const [showTooltip, setShowTooltip] = useState(false);
    
    const myRef = useRef(null);

    useEffect(() => {
       
        const obj=myRef.current
        if (obj.scrollHeight > obj.clientHeight || obj.scrollWidth > obj.clientWidth){
            setShowTooltip(true);
        }
       
    }, [showTooltip]);

        return(
         
            <div className="my-card-application roboto-b1 text-truncate my-tooltip-container" style={{paddingLeft:'2px',width:'160px'}} data-tooltip-id={showTooltip?"tooltip-application-name":""} data-tooltip-content={showTooltip?props.nameApplication:""} ref={myRef}>
                {props.nameApplication}
                {showTooltip && <Tooltip id="tooltip-application-name" className="my-tooltip"/>}
            </div>
        )
      
    

}

export default TaskCardApplicationName;