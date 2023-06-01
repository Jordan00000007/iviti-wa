import React, { useState,useEffect,useRef } from 'react';
import { Tooltip } from 'react-tooltip';

function TaskCardTaskName(props) {

    const [showTooltip, setShowTooltip] = useState(false);
    
    const myRef = useRef(null);

    useEffect(() => {
       
        const obj=myRef.current
        if (obj.scrollHeight > obj.clientHeight || obj.scrollWidth > obj.clientWidth){
            setShowTooltip(true);
        }
       
    }, [showTooltip]);

        return(
            <div className="text-truncate my-tooltip-container" data-tooltip-id={showTooltip?"tooltip-task-name":""} data-tooltip-content={showTooltip?props.nameTask:""} ref={myRef}>
                {props.nameTask}
                {showTooltip && <Tooltip id="tooltip-task-name" className="my-tooltip" />}
            </div>
        )
      
    

}

export default TaskCardTaskName;