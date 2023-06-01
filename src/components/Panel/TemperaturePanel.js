import React, { useEffect, useState } from 'react';
import log from "../../utils/console";
import { useDispatch, useSelector } from "react-redux";


const TemperaturePanel = (props) => {

    const dispatch = useDispatch();

    const [myInterval, setMyInterval] = useState(null);

    const myData = useSelector((state) => state.tasks.data);
    const myTemp = useSelector((state) => state.tasks.temperature);
    const myIndex = myData.findIndex(item => item.uuid === props.uuid);
    const myItem = myData[myIndex];
    //log(myItem)
    let timer=null;

    return (
        <div className='my-area-b3 d-flex justify-content-between align-items-center'>
            <div className='my-area-b3-1 roboto-h5 d-flex justify-content-between align-items-center'>
                Temperature
            </div>
            <div className='my-area-b3-2 d-flex justify-content-end'>
                <div className='my-area-b3-2-1 roboto-h1 d-flex justify-content-end align-items-center'>
                    {props.status==='running'?myTemp:'N/A'}
                </div>
                <div className='my-area-b3-2-2 roboto-b2 d-flex justify-content-end align-items-center'>
                    °C
                </div>
            </div>
        </div>
    )
}

export default TemperaturePanel;