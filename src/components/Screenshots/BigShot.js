import React, { useRef, useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import log from "../../utils/console";
import EventIconSample from '../../assets/event_icon_sample.png';
import EventAreaDisplay from '../../components/Drawing/EventAreaDisplay';

const BigShot = (props) => {


    const [data, setData] = useState(null);


    const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;

    // useEffect(() => {

    //     //log(props.toggle)

    //     const myData={};
    //     myData.timestamp=props.uuid.toString();
    //     myData.draw_results=props.toggle;

    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(myData)
    //     };
    //     fetch(`${TASK_SERVER}/events/screenshot`, requestOptions)
    //         .then(response => response.blob())
    //         .then(blob => {
    //             setData(URL.createObjectURL(blob))
    //         })


    // // empty dependency array means this effect will only run once (like componentDidMount in classes)
    // }, [props.toggle]);

    useEffect(() => {

        if (props.toggle) {
            setData(props.image1);
        }else{
            setData(props.image2);
        }

    }, [props.toggle]);

    return (
        <div style={{ width: 648, height: 400, background: 'black', border: '0px' }} className='position-relative d-flex justify-content-center align-items-center'>
            <img src={data} style={{ maxWidth: 648, maxHeight: 400 }} />
            {
                props.toggle &&
                <EventAreaDisplay area={props.area.area_point} ></EventAreaDisplay>
            }

        </div>
    );
};

export default BigShot;