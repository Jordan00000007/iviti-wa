import React, { useState, useEffect, useRef } from 'react';
import log from "../../utils/console";
import AppIcon from '../Icons/AppIcon'
import CustomButton from '../Buttons/CustomButton';
import StatusButton from '../Buttons/StatusButton';
import ToggleButton from '../Buttons/ToggleButton';
import CustomTooltip from '../Tooltips/CustomTooltip';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import { tasksActions, runTask, stopTask, runStream, stopStream, addStream, deleteStream } from "../../store/tasks";

const TaskCard = (props) => {

    // const [name, setName] = useState("");
    const [status, setStatus] = useState(props.nameStatus);
    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myIndex = myData.findIndex(item => item.task_uid === props.task_uid);
    const myItem = myData[myIndex];

    const init = [];
    const [state, setState] = useState(init);
    const dummyState = useRef(init);

    const handleClickEdit = () => {

        log('Edit Button clicked!');

    };

    const handleClickView = () => {

        log('View Button clicked!');

    };

    const handleToggleChange = (event) => {

        log('toogle change')
        log(props.task_uid)

        if (event.target.checked) {
            dispatch(runTask(props.task_uid));
        } else {
            dispatch(stopTask(props.task_uid));
        }

    }

    // useEffect(() => {
    //     // Compare the old state with the new state
    //     if (dummyState.current == state) {
    //         // This means that the component is mounting
    //         log(`--- This means that the component is mounting`)
           
    //     } else {
    //         // This means that the component updated.
    //         log(`--- This means that the component updated`)
    //         dummyState.current = state;
    //         if (myItem.status === 'run'){
    //             props.showMessage(0, 'Set streaming run success')
    //         }
    //         if (myItem.status === 'stop') {

    //             props.showMessage(0, 'Set streaming stop success')
    //         }
          
    //     }
    // }, [state,myItem.status]);

    useEffect(() => {



        if (myItem.status === 'set_task_run_success') {
            dispatch(addStream(props.task_uid));
            //dispatch(runStream(props.task_uid));
        }
        // if (myItem.status === 'set_stream_add_success') {
        //     dispatch(runStream(props.task_uid));
        // }
        if (myItem.status === 'set_task_stop_success') {
            dispatch(deleteStream(props.task_uid));
        }
        // if (myItem.status === 'set_stream_stop_success') {
        //     dispatch(deleteStream(props.task_uid));
        // }

        if ("apiError" in myItem)
        {
            if((myItem.apiError!==undefined)&&(myItem.apiError!==''))
                props.showMessage(1,myItem.apiError);
        }

        if ("apiSuccess" in myItem)
        {
            if((myItem.apiSuccess!==undefined)&&(myItem.apiSuccess!==''))
                props.showMessage(0,myItem.apiSuccess);
        }
      

    }, [myItem.status]);

    //   useEffect(() => {
    //     if(isFirst){
    //       isFirst = false
    //       return
    //     }
    //     if (myItem.status==='run'){
    //         props.showMessage(0,'Set streaming run success')
    //     }
    //     if (myItem.status==='stop'){
    //         props.showMessage(0,'Set streaming stop success')
    //     }

    //   //your code that don't want to execute at first time
    // },[myItem.status])

    return (
        <div className="card border-0">
            <div className="card-body my-card-l p-3">
                <div className="row p-1 gy-0">
                    <div className="col-12 roboto-h4 mb-2 ">
                        <CustomTooltip customClassName='roboto-h4'>
                            {props.nameTask}
                        </CustomTooltip>
                    </div>
                    <div className="col-12 mb-2">
                        <div className="card border-0">
                            <div className="card-body  my-card-m p-2">
                                <div className="row p-1">
                                    <div className="col-12 d-flex flex-row gap-2">
                                        <div>
                                            <AppIcon nameApplication={props.nameApplication}></AppIcon>
                                        </div>
                                        <div className="d-flex flex-column gap-1">

                                            <CustomTooltip customClassName='my-card-application-name'>
                                                {props.nameApplication}
                                            </CustomTooltip>

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
                                    <div className="d-flex flex-row gap-2" style={{ paddingTop: '1px', paddingLeft: '8px' }}>
                                        <div className="my-card-status roboto-b2" style={{ paddingTop: '2px' }}>
                                            Status
                                        </div>
                                        <div>
                                            <StatusButton name={myItem.status} className="mb-2" />
                                        </div>
                                    </div>
                                    <div style={{ paddingTop: '4px', paddingRight: '5px' }}>
                                        <ToggleButton onChange={handleToggleChange} status={status} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-1 d-flex justify-content-between">
                        {(myItem.status !== 'running') &&
                            <Link to={`/editTask/${props.task_uid}`}>
                                <CustomButton onClick={handleClickEdit} disabled={myItem.status === 'running' ? true : false} name="edit" />
                            </Link>
                        }
                        <Link to={`/inference/${props.task_uid}`}>
                            <CustomButton onClick={handleClickView} status={myItem.status} name="view" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};



export default TaskCard;