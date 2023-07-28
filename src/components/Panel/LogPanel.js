import React,{useEffect} from 'react';
import log from "../../utils/console";

const LogPanel = (props) => {
  
    // useEffect(() => {

    //     log('log panel data');
    //     log(props);
        
    // }, [props]);

    if ((props.data!==[])&&(props.status==='run'))
    return (
        <div className='d-flex flex-column my-frame-container roboto-b1'>
            <div className='my-log-container'>
                {props.data.map((item, idx) => (    
                    <div key={idx}  className='my-frame-info'>
                   
                        {
                            (item.data!=='')&&
                            item.data.map((item2, idx2) => (
                                <div key={idx2} className='my-frame-item'>
                                    {JSON.stringify(item2)}
                                </div>
                            ))
                        }
                        <hr className="my-divider" />
                    </div>
                ))}
            </div>
        </div>
    )

    if ((props.status!=='run')&&(props.status!=='stop')){

        if (props.status.toLowerCase().indexOf('error')>=0)
        return (
            <div className='d-flex flex-column my-frame-container roboto-b1'>
                {props.status} 
                <br/>
                {props.apiError}
            </div>
        )
      
        if ((props.status.indexOf('run')>=0)||(props.status.indexOf('add')>=0))
        return (
            <div className='d-flex flex-column my-frame-container roboto-b1'>
                Initialing...
                <br/>
                Get streaming...
            </div>
        )

        if ((props.status.indexOf('stop')>=0)||(props.status.indexOf('delete')>=0))
        return (
            <div className='d-flex flex-column my-frame-container roboto-b1'>
                Stop streaming...
            </div>
        )

        log('log status')
        log(props.status)
    }

    return (
        <div className='d-flex flex-column my-frame-container roboto-b1'>
            Switch on the AI task to get log.
        </div>
    )
}

export default LogPanel;