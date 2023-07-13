import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import log from "../utils/console";
import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import StatusButton from '../components/Buttons/StatusButton';
import ToggleButton from '../components/Buttons/ToggleButton';

import DependOnPanel from '../components/Panel/DependOnPanel';
import TemperaturePanel from '../components/Panel/TemperaturePanel';
import CustomAlert from '../components/Alerts/CustomAlert';
import GeneralTooltip from '../components/Tooltips/GeneralTooltip';

import CustomDisplay from '../components/Drawing/CustomDisplay'

import RemoteVideo from '../components/Video/RemoteVideo';

import CustomTooltip from '../components/Tooltips/CustomTooltip';

import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchData, fetchTask, runTask, stopTask, addStream, deleteStream, deviceTemperature } from "../store/tasks";
import { resetUpdateStatus } from "../store/areas";

import { WebSocket } from '../components/Panel/WebSocket';




function AiInference() {


    const [fps, setFps] = useState('N/A');
    const [liveTime, setLiveTime] = useState('0 day 0 hour 0 min');
    const fpsRef = useRef(null);
    const videoPanelRef = useRef(null);

    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('test');
    const [playing, setplaying] = useState(false);

    const [fullScreen, setFullScreen] = useState(false);

    const [basicType, setBasicType] = useState(false);

    const [disabled, setDisabled] = useState(false);

    const [temp, setTemp] = useState('N/A');
 
    const alertRef = useRef();
 
    //const [uuid, setUuid] = useState('0');
    const params = useParams();
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    
    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myStatus = useSelector((state) => state.tasks.status);
    const myIndex = myData.findIndex(item => item.task_uid === params.uuid);

    const taskUpdateMessage = useSelector((state) => state.tasks.updateMessage);
    const taskUpdateStatus = useSelector((state) => state.tasks.updateStatus);


    let myItem = myData[myIndex];
   
    if (myItem===undefined){
        myItem={};
        myItem.status=null;
    }

    const setMessageOpen=(showType,showText)=>{
        setShowType(showType);
        setShowText(showText);
        alertRef.current.setShowTrue();
       
    };

    const handleClickBack = () => {
        log('Add Button clicked!');
    };


    const handleToggleChange = (event) => {

        if (event.target.checked) {
            dispatch(runTask(params.uuid));
        } else {
            dispatch(stopTask(params.uuid));
        }
    };

    const handleLabelExpandClick = () => {
        log('Label Expand Click!');
    };


    const handleLogTabClick = () => {

        // ws://192.168.8.134:819/ws/results

        log('handle Log Tab Click')
        //  connectWebSocket();
    }

    const handleUpdateTemp = (temp) => {

        setTemp(temp);
    }

    const handleEditClick=()=>{

        window.location.href=`/editTask/${params.uuid}/1`;

    }

    const handlePlaying=(myValue)=>{

        setplaying(myValue);

    }

    const handleVideoClick=()=>{

        log('handle video click')
        setFullScreen(true);
        // videoPanelRef.current.requestFullscreen();

    }


    useEffect(() => {
        dispatch(fetchData());
        //dispatch(getAllModels());
    }, []);


    useEffect(() => {

        if (myItem !== undefined) {
            
            log('my item')
            log(myItem)
        
            if (myItem.status!==null){
                log('-------------')
                log()
                if (myItem.app_name[0].toLowerCase().indexOf('basic')>=0){
                    setBasicType(true);
                    log('set basic type true')
                }
            }

          

            if ((myItem.status) && (myStatus === 'success')) {
                if (myItem.status === 'set_task_run_success') {
                    log('add stream start')
                    log(params.uuid)
                    dispatch(addStream(params.uuid));
                }
               
                if (myItem.status === 'set_task_stop_success') {
                    dispatch(deleteStream(params.uuid));
                }

            }

            if ("apiError" in myItem)
            {
                if((myItem.apiError!==undefined)&&(myItem.apiError!==''))
                    setMessageOpen(1,myItem.apiError);
            }
    
            if ("apiSuccess" in myItem)
            {
                if((myItem.apiSuccess!==undefined)&&(myItem.apiSuccess!==''))
                    setMessageOpen(0,myItem.apiSuccess);
            }
        }


    }, [myItem.status]);

    useEffect(() => {

        if ((taskUpdateMessage!=='')&&(taskUpdateStatus==='success')&&(myStatus==='success')){
          
            setMessageOpen((taskUpdateStatus==='success')?0:1, taskUpdateMessage);
            dispatch(resetUpdateStatus());
        }

    }, [taskUpdateStatus,myStatus]);

   
    if (myStatus === 'success')
        return (
            <SimpleLayout>
                <CustomAlert message={showText} type={showType} ref={alertRef}/>
                <div className="container p-0">
                    <div className="my-body">
                        <div className="row p-0 g-0 mb-3 mt-3">
                            <div className="col-12 d-flex justify-content-between align-items-center my-flex-gap">
                                <div className='d-flex flex-row my-flex-gap'>
                                    <div>
                                        <Link to="/">
                                            <CustomButton name="back" />
                                        </Link>
                                    </div>

                                    <div className="my-body-title roboto-h2">
                                        {(myItem.task_name) ? myItem.task_name : ""}
                                    </div>

                                    <div className='d-flex justify-content-start align-items-center'>
                                        <ToggleButton onChange={handleToggleChange} status={myItem.status} />
                                    </div>
                                </div>
                               
                                {
                                    (myItem.status === 'stop')&&
                                    <CustomButton name="edit" onClick={handleEditClick} width="100"/>
                                }
                                    
                            
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
                                                        {
                                                            ((myItem.status==='run')&&(myItem.liveTime)) &&
                                                            <>
                                                                <GeneralTooltip title="Task running time">
                                                                    <span className="my-time-badge roboto-b2">{myItem.liveTime}</span>
                                                                </GeneralTooltip>
                                                            </>
                                                            
                                                        }
                                                    </div>
                                                    <div className='my-area-a2 position-relative' onChange={handleVideoClick} ref={videoPanelRef}>
                                                        <RemoteVideo uuid={params.uuid} status={myItem.status} onPlaying={handlePlaying} fullScreen={fullScreen} />
                                                        <CustomDisplay uuid={myItem.source_uid} playing={playing} onClick={handleVideoClick}></CustomDisplay> 
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
                                                                                {myItem.task_name}
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
                                                                                {myItem.source_name}
                                                                            </CustomTooltip>

                                                                        </div>
                                                                    </div>
                                                                    <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                        <div className='my-area-b1-1-1 roboto-b1'>
                                                                            Model
                                                                        </div>
                                                                        <div className='my-area-b1-1-2 roboto-b1'>
                                                                            <CustomTooltip>
                                                                                {myItem.model_name}
                                                                            </CustomTooltip>
                                                                        </div>
                                                                    </div>
                                                                    <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                        <div className='my-area-b1-1-1 roboto-b1'>
                                                                            Application
                                                                        </div>
                                                                        <div className='my-area-b1-1-2 roboto-b1'>
                                                                            {myItem.app_name.toString().replace("_"," ").replace("_"," ")}
                                                                        </div>
                                                                    </div>
                                                                    <div className='my-area-b1-1  d-flex justify-content-between'>
                                                                        <div className='my-area-b1-1-1 roboto-b1'>
                                                                            Confidence
                                                                        </div>
                                                                        <div className='my-area-b1-1-2 roboto-b1'>
                                                                            {myItem.model_setting.confidence_threshold}
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
                                                                            {((myItem.status==='run')&&(myItem.fps))?myItem.fps:"N/A"}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <DependOnPanel uuid={params.uuid} onClick={handleLabelExpandClick} basicType={basicType}/> 
                                                                <TemperaturePanel uuid={params.uuid} status={myItem.status} temp={temp}/>
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="log" role="tabpanel" aria-labelledby="log-tab">
                                                            <div className='my-tab-container'>
                                                                <WebSocket uuid={params.uuid} status={myItem.status} device={myItem.device} updateTemp={handleUpdateTemp}/>
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
