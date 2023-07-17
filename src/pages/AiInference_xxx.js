import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import log from "../utils/console";
import ReactPlayer from 'react-player';
import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import StatusButton from '../components/Buttons/StatusButton';
import ToggleButton from '../components/Buttons/ToggleButton';

import DependOnPanel from '../components/Panel/DependOnPanel';
import TemperaturePanel from '../components/Panel/TemperaturePanel';

import CustomeWebRTC from '../components/Video/CustomeWebRTC';

import CustomTooltip from '../components/Tooltips/CustomTooltip';

import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchData, fetchTask, runTask, stopTask, addStream, runStream, stopStream, deleteStream, deviceTemperature } from "../store/tasks";
import defaultImage from '../assets/image-regular.svg';
import { WebSocketDemo } from '../components/Panel/WebSocketDemo';
import moment from 'moment';


function AiInference() {

   
    const [fps, setFps] = useState('N/A');
    const [liveTime, setLiveTime] = useState('0 day 0 hour 0 min');



    //const [uuid, setUuid] = useState('0');
    const params = useParams();
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    const STREAM_URL = `${STREAM_SERVER}/stream/${params.uuid}/channel/0/hls/live/index.m3u8`;

    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myStatus = useSelector((state) => state.tasks.status);
    const myIndex = myData.findIndex(item => item.uuid === params.uuid);
    const myItem =  myData[myIndex];

    useEffect(() => {
        dispatch(fetchData());
    }, []);

    useEffect(() => {
        if (myStatus==='success'){
            dispatch(fetchTask(params.uuid));
        }
    }, [myStatus]);

    // useEffect(() => {
    //     dispatch(deviceTemperature());
    // }, [dispatch]);

    // useEffect(() => {
    //     if ((myItem.status)&&(myStatus==='success')){
    //         if (myItem.status==='set_task_run_success'){
    //             dispatch(addStream(params.uuid));
    //         }
    //         if (myItem.status==='set_stream_add_success'){
    //             dispatch(runStream(params.uuid));
    //         }
    //         if (myItem.status==='set_task_stop_success'){
    //             dispatch(stopStream(params.uuid));
    //         }
    //         if (myItem.status==='set_stream_stop_success'){
    //             dispatch(deleteStream(params.uuid));
    //         }
    //     }
       
    //   }, [myItem.status]);

    const handleClickBack = () => {
        log('Add Button clicked!');
    };

    const handleToggleChange = (event) => {
       
        if (event.target.checked){
            dispatch(runTask(params.uuid));         
        }else{
            dispatch(stopTask(params.uuid));
        }
    };

    const handleLabelExpandClick = () => {
        log('Label Expand Click!');
    };


    const handleLogTabClick=()=>{

        // ws://192.168.8.134:819/ws/results

        log('handle Log Tab Click')
        //  connectWebSocket();
    }

    const handleUpdateInfo=(currentFPS,currentLiveTime)=>{
        
        setFps(currentFPS);
        const duration=moment.duration(currentLiveTime,'seconds');
        const minutes=duration.minutes();
        const hours=duration.hours();
        const days=duration.days();
        setLiveTime(`${days} ${(days>1)?'days':'day'} ${hours} ${(hours>1)?'hours':'hour'} ${minutes} ${(minutes>1)?'mins':'min'}`)
       
    }

    if (myStatus === 'success') 
    return (
        <SimpleLayout>
            <div className="container p-0">
                <div className="my-body">
                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap">
                            <div>
                                <Link to="/">
                                    <CustomButton name="back" />
                                </Link>
                            </div>
                            
                            <div className="my-body-title roboto-h2">
                                {(myItem.name) ? myItem.name : ""}
                            </div>
                            
                            <div className='d-flex justify-content-start align-items-center'>
                                <ToggleButton onChange={handleToggleChange} status={myItem.status} />
                            </div>
                        </div>
                    </div>
                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-between my-area-container bdr">

                            <table className='w-100'>
                                <tbody>
                                    <tr>
                                        <td className='my-area-a'>
                                            <div className='w-100 '>
                                                <div className='my-area-a1 d-flex justify-content-center align-items-center'>
                                                    <span className="my-time-badge roboto-b2">{liveTime}</span>
                                                </div>
                                                <div className='my-area-a2'>
                                                    <CustomeWebRTC uuid={params.uuid} status={myItem.status}/>
                                                </div>
                                                <div className='my-area-a3'>
                                                    
                                                </div>

                                            </div>
                                        </td>
                                        <td className='my-area-b'>
                                            <div className='w-100 h-100 '>
                                                <ul className="nav nav-tabs flex-nowrap" id="myTab" role="tablist">
                                                    <li className="nav-item" role="presentation">
                                                        <button className="my-nav-link active roboto-h4" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true">Info</button>
                                                    </li>
                                                    <li className="nav-item" role="presentation">
                                                        <button className="my-nav-link roboto-h4" id="log-tab" data-bs-toggle="tab" data-bs-target="#log" type="button" role="tab" aria-controls="log" aria-selected="false" onClick={handleLogTabClick}>Log</button>
                                                    </li>
                                                </ul>
                                                <div className="tab-content" id="myTabContent">
                                                    <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                                                        <div className='my-tab-container'>
                                                            <div className='my-area-b1'>
                                                                <div className='my-area-b1-1 d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        AI task name
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        <CustomTooltip>
                                                                                {myItem.name}
                                                                        </CustomTooltip>
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        Status
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        <StatusButton name={myItem.status} />
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        Source
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        <CustomTooltip>
                                                                            {myItem.source}
                                                                        </CustomTooltip>
                                                                        
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        Model
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        <CustomTooltip>
                                                                            {myItem.model}
                                                                        </CustomTooltip>
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        Application
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        {myItem.application.name}
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        Confidence
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        {myItem.thres}
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        Accelerator
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        {myItem.device}
                                                                    </div>
                                                                </div>
                                                                <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                    <div className='my-area-b1-1-1 roboto-b1'>
                                                                        FPS
                                                                    </div>
                                                                    <div className='my-area-b1-1-2 roboto-b1'>
                                                                        {fps}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <DependOnPanel uuid={params.uuid}/>
                                                            <TemperaturePanel />
                                                        </div>
                                                    </div>
                                                    <div className="tab-pane fade" id="log" role="tabpanel" aria-labelledby="log-tab">
                                                        <div className='my-tab-container'>
                                                            <WebSocketDemo uuid={params.uuid} updateInfo={handleUpdateInfo}/>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </SimpleLayout>
    );

    return (
        <SimpleLayout>
        </SimpleLayout>
    )

}

export default AiInference;
