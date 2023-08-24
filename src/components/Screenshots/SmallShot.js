import React, { useRef, useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import log from "../../utils/console";
import EventIconSample from '../../assets/event_icon_sample.png';

const SmallShot = (props) => {


    const [data, setData] = useState(null);


    const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;

    useEffect(() => {

        log('start_time')
        log(props.data.start_time)

        // const myData={};
        // myData.timestamp=props.startTime.toString();
        // myData.draw_results=false;
       
        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(myData)
        // };
        // fetch(`${TASK_SERVER}/events/screenshot`, requestOptions)
        //     .then(response => response.blob())
        //     .then(blob => {
        //         setData(URL.createObjectURL(blob))
        //     })
           
    
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);
   
    return (
        <div style={{ width: 66, height:66, background: 'black', border: '0px' }} className='d-flex align-items-center'>
            <img src={data} style={{ maxWidth: 66, maxHeight: 66 }}/>
        </div>
    );
};

export default SmallShot;