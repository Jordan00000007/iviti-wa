import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import log from "../../utils/console";
import AppIcon from '../Icons/AppIcon'
import CustomButton from '../Buttons/CustomButton';
import ExtendButton from '../Buttons/ExtendButton';
import StatusButton from '../Buttons/StatusButton';
import ToggleButton from '../Buttons/ToggleButton';
import CustomTooltip from '../Tooltips/CustomTooltip';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { tasksActions, runTask, stopTask, runStream, stopStream, addStream, deleteStream } from "../../store/tasks";

const TaskCard = (props) => {

    // const [name, setName] = useState("");
    const [status, setStatus] = useState(props.nameStatus);
    const [disabled, setDisabled] = useState(false);

    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myIndex = myData.findIndex(item => item.task_uid === props.task_uid);
    const myItem = myData[myIndex];
    const navigate = useNavigate();


    const init = [];
    const [state, setState] = useState(init);
    const dummyState = useRef(init);
    const toggleRef = useRef(null);

    const handleClickEdit = (e) => {

        e.stopPropagation(); 
        window.location.href=`/editTask/${props.task_uid}/0`;

    };

    const handleClickView = (e) => {

        e.stopPropagation(); 
        window.location.href=`/inference/${props.task_uid}`;

    };

    const getToggleDisabled=()=>{

        log('get toggle disabled')
        log(toggleRef.current.getDisabled())
        //return toggleRef.current.getToggleDisabled();
    }

    const handleToggleChange = (event) => {

        log('toogle change')
        log(props.task_uid)

      
        setDisabled(true);

        if (event.target.checked) {
            dispatch(runTask(props.task_uid));
        } else {
            dispatch(stopTask(props.task_uid));
        }

    }


    const handleCardClick = (event) => {

        log('handle card click')
        if (!disabled){
           window.location.href=`/inference/${props.task_uid}`;
        }
        
    }


    useEffect(() => {
        // Compare the old state with the new state
        if ((myItem.status==='run')||(myItem.status==='stop')||(myItem.status.indexOf('error')>=0)) {
            
           setDisabled(false)
        } 
    }, [myItem.status]);

    useEffect(() => {


        if (myItem.status === 'set_task_run_success') {
            dispatch(addStream(props.task_uid));
            //dispatch(runStream(props.task_uid));
        }
       
        if (myItem.status === 'set_task_stop_success') {
            dispatch(deleteStream(props.task_uid));
        }
       
        if ("apiError" in myItem)
        {
            if((myItem.apiError!==undefined)&&(myItem.apiError!=='')){
                props.showMessage(1,myItem.apiError);
              
            }
               
        }

        if ("apiSuccess" in myItem)
        {
            // if((myItem.apiSuccess!==undefined)&&(myItem.apiSuccess!==''))
            //     props.showMessage(0,myItem.apiSuccess);
        }
      

    }, [myItem.status]);

   
    return (
        <div className="card border-0">
            <div className="card-body my-card-l p-3" style={{cursor:(disabled)?'arrow':'pointer'}} >
                <div className="row p-1 gy-0">
                    <div className="col-12 roboto-h4 mb-2 d-flex flex-row justify-content-between" onClick={handleCardClick}>
                        <CustomTooltip customClassName='roboto-h4'>
                            {props.nameTask}
                        </CustomTooltip>

                        <ExtendButton type={2} uuid={props.task_uid} taskName={props.nameTask}></ExtendButton>
                    </div>
                    <div className="col-12 mb-2" onClick={handleCardClick}>
                        <div className="card border-0">
                            <div className="card-body  my-card-m p-2">
                                <div className="row p-1">
                                    <div className="col-12 d-flex flex-row gap-2">
                                        <div>
                                            <AppIcon nameApplication={props.nameApplication}></AppIcon>
                                        </div>
                                        <div className="d-flex flex-column gap-1">

                                            <div className='roboto-h6' style={{'whiteSpace':'nowrap'}}>
                                                {props.nameApplication.toString().replace("_"," ").replace("_"," ")}
                                            </div>
                                           
                                            

                                            <CustomTooltip customClassName='my-card-model-name'>
                                                {props.nameModel}
                                            </CustomTooltip>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-12 mb-3 mt-1">
                        <div className="card border-0">
                            <div className="card-body my-card-s p-1">
                                <div className="d-flex flex-row justify-content-between gap-1 mt-0 mb-2">
                                    <div className="d-flex flex-row gap-2" style={{ paddingTop: '1px', paddingLeft: '8px' }} onClick={handleCardClick}>
                                        <div className="my-card-status roboto-b2" style={{ paddingTop: '2px' }}>
                                            Status
                                        </div>
                                        <div>
                                            <StatusButton name={myItem.status} className="mb-2" />
                                            
                                        </div>
                                    </div>
                                    <div style={{ paddingTop: '4px', paddingRight: '5px' }}>
                                        <ToggleButton onChange={handleToggleChange} status={myItem.status} ref={toggleRef} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-1 d-flex justify-content-between">
                        { ((myItem.status === 'stop')||(myItem.status.indexOf("error")>=0)) &&
                            
                            <CustomButton onClick={handleClickEdit} disabled={myItem.status === 'run' ? true : false} name="edit" width="115"/>
                            
                        }
                       
                        <CustomButton onClick={handleClickView} status={myItem.status} name="view" disabled={disabled} width="115"/>
                       
                    </div>
                </div>
            </div>
        </div>
    );
};



export default TaskCard;