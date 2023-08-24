import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import log from "../utils/console";

import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import moment from "moment";

import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import StatusButton from '../components/Buttons/StatusButton';
import ToggleButton from '../components/Buttons/ToggleButton';
import BigShot from '../components/Screenshots/BigShot';
import PredictionToggleButton from '../components/Buttons/PredictionToggleButton';

import CustomInput from '../components/Inputs/CustomInput';

import DependOnPanel from '../components/Panel/DependOnPanel';
import TemperaturePanel from '../components/Panel/TemperaturePanel';
import CustomAlert from '../components/Alerts/CustomAlert';
import GeneralTooltip from '../components/Tooltips/GeneralTooltip';

import CustomDivider from '../components/Dividers/CustomDivider';

import CustomDisplay from '../components/Drawing/CustomDisplay';


import EventCard from '../components/Cards/EventCard';

import RemoteVideo from '../components/Video/RemoteVideo';

import CustomTooltip from '../components/Tooltips/CustomTooltip';

import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchData, fetchTask, runTask, stopTask, addStream, deleteStream, deviceTemperature, setTaskStatus } from "../store/tasks";
import { resetUpdateStatus } from "../store/areas";

import { WebSocket } from '../components/Panel/WebSocket';

import { FullScreen, useFullScreenHandle } from "react-full-screen";



import WarnningPanel from '../components/Panel/WarnningPanel';




function AiInference() {

    const handle = useFullScreenHandle();

    const [fps, setFps] = useState('N/A');
    const [liveTime, setLiveTime] = useState('0 day 0 hour 0 min');
    const fpsRef = useRef(null);
    const videoPanelRef = useRef(null);

    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('test');
    const [playing, setplaying] = useState(false);

    const [fullScreen, setFullScreen] = useState(false);

    const [showPredictPic, setShowPredictPic] = useState(true);

    const [showEventModal, setShowEventModal] = useState(false);

    const [eventArr, setEventArr] = useState([]);

    const [basicType, setBasicType] = useState(false);

    const eventInitData={};
    eventInitData.uid="";
    eventInitData.title="";
    eventInitData.app_uid="";
    eventInitData.start_time="";
    eventInitData.end_time="";
    eventInitData.annotation={"area":{"name":"","area_point":[]}};
    

    const [eventModalData,setEventModalData] = useState(eventInitData);

    const [disabled, setDisabled] = useState(false);

    const [temp, setTemp] = useState('N/A');

    const alertRef = useRef();
    const predictionToggleRef = useRef();

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


    if (myItem === undefined) {
        myItem = {};
        myItem.status = null;
    }

    const setMessageOpen = (showType, showText) => {
        setShowType(showType);
        setShowText(showText);
        if (alertRef.current){
            alertRef.current.setShowTrue(3000);
        }
        

    };

    const handleClickBack = () => {
        log('Add Button clicked!');
    };

    const handleEventCardClick = (myData) => {
        
        setEventModalData(myData);
        setShowEventModal(true);
    }

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

    const handleAddEvent = (myData) => {

        if (myData.app_uid===params.uuid){
            let tmpEvent=[myData].concat(eventArr);
            if (tmpEvent.length>11){
                tmpEvent=tmpEvent.slice(0,11);
            }
            setEventArr(tmpEvent);

            // let tmpEvent=eventArr;
            // tmpEvent.push(myData);
            // if (tmpEvent.length>3){
            //     tmpEvent=tmpEvent.slice(-3);
            // }
            // setEventArr(tmpEvent);
          
        }
    }

    const handleWebSocketError = (myType, myMsg) => {

       

        setMessageOpen(1, myMsg);

        // const myData = {};
        // myData.task_uid = params.uuid;
        // myData.status = myType;
        // myData.message = myMsg;

        // dispatch(setTaskStatus(myData));
    
    }

    const formatEventTime = (myStartTime) => {
    
        return moment(parseInt(myStartTime.toString().slice(0,13))).format("YYYY-MM-DD HH:mm:ss") 
    }

    const handleEditClick = () => {

        window.location.href = `/editTask/${params.uuid}/1`;

    }

    const handlePlaying = (myValue) => {

        setplaying(myValue);

    }

    const handlePredictionChange = (event) => {
     
        if (predictionToggleRef.current.getIsChecked()){
            setShowPredictPic(false);
        }else{
            setShowPredictPic(true);
        };

    }

    const handleVideoClick = () => {

        if ((playing) && (!handle.active)) {
            handle.enter();
        } else if (handle.active) {
            handle.exit();
        }

    }

    useEffect(() => {

        if (handle.active) {
            setFullScreen(true);
        } else {
            setFullScreen(false);
        }

    }, [handle]);


    useEffect(() => {
        dispatch(fetchData());
        //dispatch(getAllModels());
    }, []);


    useEffect(() => {

        if (myItem !== undefined) {

            if (myItem.status !== null) {

                if (myItem.app_name.toLowerCase().indexOf('basic') >= 0) {
                    setBasicType(true);
                    //log('set basic type true')
                } else {
                    setBasicType(false);
                    //log('set basic type false')
                }

            }

           
            if ((myItem.status) && (myStatus === 'success')) {
                if (myItem.status === 'set_task_run_success') {

                    log('run task success, then try add stream')
                    dispatch(addStream(params.uuid));
                }

                if (myItem.status === 'set_task_stop_success') {
                    dispatch(deleteStream(params.uuid));
                }

            }

            if ("apiError" in myItem) {
                if ((myItem.apiError !== undefined) && (myItem.apiError !== ''))
                    setMessageOpen(1, myItem.apiError);
            }

            if ("apiSuccess" in myItem) {
                if ((myItem.apiSuccess !== undefined) && (myItem.apiSuccess !== ''))
                    setMessageOpen(0, myItem.apiSuccess);
            }
        }


    }, [myItem.status, myStatus]);

    useEffect(() => {

        if ((taskUpdateMessage !== '') && (taskUpdateStatus === 'success') && (myStatus === 'success')) {

            setMessageOpen((taskUpdateStatus === 'success') ? 0 : 1, taskUpdateMessage);
            dispatch(resetUpdateStatus());
        }

    }, [taskUpdateStatus, myStatus]);


    if (myStatus === 'success')
        return (
            <SimpleLayout>
                <CustomAlert message={showText} type={showType} ref={alertRef} />
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

                                    
                                    <CustomTooltip customClassName="my-body-title roboto-h2">
                                        {(myItem.task_name) ? myItem.task_name : ""}
                                    </CustomTooltip>
                                    

                                    <div className='d-flex justify-content-start align-items-center'>
                                        <ToggleButton onChange={handleToggleChange} status={myItem.status} />
                                    </div>
                                </div>

                                {
                                    ((myItem.status === 'stop')||(myItem.status.toLowerCase().indexOf('error')>=0)) &&
                                    <CustomButton name="edit" onClick={handleEditClick} width="100" />
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
                                                            ((myItem.status === 'run') && (myItem.liveTime)) &&
                                                            <>
                                                                <GeneralTooltip title="Task running time">
                                                                    <span className="my-time-badge roboto-b2">{myItem.liveTime}</span>
                                                                </GeneralTooltip>
                                                            </>

                                                        }
                                                    </div>
                                                    <FullScreen handle={handle}>
                                                        <div className={fullScreen ? 'my-area-a2' : 'my-area-a2 position-relative'} onChange={handleVideoClick} ref={videoPanelRef}>
                                                            <RemoteVideo uuid={params.uuid} status={myItem.status} onPlaying={handlePlaying} fullScreen={fullScreen} />
                                                            <CustomDisplay uuid={myItem.source_uid} playing={playing} onClick={handleVideoClick} fullScreen={fullScreen}></CustomDisplay>
                                                        </div>
                                                    </FullScreen>

                                                    <div className='my-area-a3'>

                                                    </div>

                                                </div>
                                            </td>
                                            <td className='my-area-b'>
                                                <div className='w-100 h-100 '>
                                                    <ul className="nav nav-tabs flex-nowrap" id="myTab" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <button className={(basicType) ? "my-nav-link-2 active roboto-h4" : "my-nav-link-3 active roboto-h4"} id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true">Info</button>
                                                        </li>
                                                        {
                                                            (!basicType) &&
                                                            <li className="nav-item" role="presentation">
                                                                <button className="my-nav-link-3 roboto-h4" id="event-tab" data-bs-toggle="tab" data-bs-target="#event" type="button" role="tab" aria-controls="event" aria-selected="true">Event</button>
                                                            </li>
                                                        }

                                                        <li className="nav-item" role="presentation">
                                                            <button className={(basicType) ? "my-nav-link-2 roboto-h4" : "my-nav-link-3 roboto-h4"} id="log-tab" data-bs-toggle="tab" data-bs-target="#log" type="button" role="tab" aria-controls="log" aria-selected="false" onClick={handleLogTabClick}>Log</button>
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
                                                                            {myItem.app_name.toString().replace("_", " ").replace("_", " ")}
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
                                                                            Inference FPS
                                                                        </div>
                                                                        <div className='my-area-b1-1-2 roboto-b1'>
                                                                            {((myItem.status === 'run') && (myItem.fps)) ? myItem.fps : "N/A"}
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <DependOnPanel uuid={params.uuid} onClick={handleLabelExpandClick} basicType={basicType} />
                                                                <TemperaturePanel uuid={params.uuid} status={myItem.status} temp={temp} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="log" role="tabpanel" aria-labelledby="log-tab">
                                                            <div className='my-tab-container'>
                                                                <WebSocket uuid={params.uuid} status={myItem.status} device={myItem.device} updateTemp={handleUpdateTemp} onEvent={handleAddEvent} onError={handleWebSocketError} apiError={myItem.apiError} />
                                                            </div>
                                                        </div>
                                                        <div className="tab-pane fade" id="event" role="tabpanel" aria-labelledby="event-tab">
                                                            <div className='my-tab-container' style={{overflowY:'scroll'}}>


                                                            {
                                                                eventArr.map((item,idx) => (
                                                                   
                                                                    <EventCard key={idx} data={item} uuid={item.start_time} onClick={handleEventCardClick}></EventCard>
                                                                ))
                                                            }

                                                                {/* <EventCard onClick={handleEventCardClick}></EventCard>
                                                                <CustomDivider />
                                                                <EventCard onClick={handleEventCardClick}></EventCard>
                                                                <EventCard onClick={handleEventCardClick}></EventCard>
                                                                <EventCard onClick={handleEventCardClick}></EventCard> */}
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


                <Modal
                    open={showEventModal}
                    onClose={(_event, reason) => {
                        setShowEventModal(false);
                      }}
                >
                    <ModalDialog
                        sx={{ minWidth: 730, maxWidth: 730, minHeight: 602 }}
                    >
                        <div className='container-fluid'>
                            <div className='row'>
                                <div className='col-12 roboto-h2 p-0'>
                                    <div style={{height:29}}>
                                        {eventModalData.title}
                                    </div>

                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 roboto-b1 p-0 d-flex justify-content-between align-items-center' style={{ color: 'var(--on_color_2)' }}>
                                    
                                        <div style={{ height:20 }}>
                                            {eventModalData.annotation.area.name}, {formatEventTime(eventModalData.start_time)} 
                                        </div>

                                        <div style={{width:144,height:36,background:'#FAFAFD',padding:'8px 10px',border:'1px solid #E0E1E6',borderRadius: 10}} className='d-flex justify-content-between'>
                                            <div style={{position:'relative'}}>
                                                <span style={{position:'absolute',top:-2}}>Prediction</span>
                                            </div>
                                            <div>
                                                <PredictionToggleButton onChange={handlePredictionChange} status={(showPredictPic)?'run':'stop'} ref={predictionToggleRef}></PredictionToggleButton>
                                            </div>
                                        </div>                                   
                                </div>
                            </div>
                            <div className='row mt-1'>
                                <div className='col-12 roboto-h2 p-0'>
                                    <div style={{ paddingTop: 5 }}>
                                        <BigShot uuid={eventModalData.start_time} area={eventModalData.annotation.area} toggle={showPredictPic}/>  
                                       
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-12 d-flex justify-content-end' style={{ padding: 0 }}>
                                    <div style={{ paddingTop: 16 }} className='d-flex gap-3'>
                                        <CustomButton name="close" onClick={() => {
                                            setShowEventModal(false);
                                        }} />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalDialog>
                </Modal>

            </SimpleLayout>
        );

    if (myStatus === 'rejected')
        return (
            <SimpleLayout>
                <WarnningPanel message="Network or server problem occurs."></WarnningPanel>
            </SimpleLayout>
        )

    return (
        <SimpleLayout>
        </SimpleLayout>
    )

}

export default AiInference;
