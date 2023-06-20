import '../css/App.css';
import React, { useEffect, useState, useRef } from 'react';
import log from "../utils/console";
import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import TaskCard from '../components/Cards/TaskCard';
import CustomAlert from '../components/Alerts/CustomAlert';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../store/tasks";
import { resetFileName } from "../store/sources";
import { resetDeleteStatus,resetAddStatus,resetUpdateStatus } from "../store/areas";


function AllAiTasks() {


    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');

    const alertRef = useRef();

    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myStatus = useSelector((state) => state.tasks.status);

    const taskDeleteMessage = useSelector((state) => state.tasks.deleteMessage);
    const taskDeleteStatus = useSelector((state) => state.tasks.deleteStatus);

    const taskAddMessage = useSelector((state) => state.tasks.addMessage);
    const taskAddStatus = useSelector((state) => state.tasks.addStatus);

    const taskUpdateMessage = useSelector((state) => state.tasks.updateMessage);
    const taskUpdateStatus = useSelector((state) => state.tasks.updateStatus);

    const setMessageOpen = (showType, showText) => {

        setShowType(showType);
        setShowText(showText);
        alertRef.current.setShowTrue(3000);

    };

    const handleClickAdd = () => {

        window.location.href = "/addTask";

    };

    useEffect(() => {
   
        if ((taskDeleteMessage!=='')&&(taskDeleteStatus==='success')&&(myStatus==='success')){
          
            setMessageOpen((taskDeleteStatus==='success')?0:1, taskDeleteMessage);
            dispatch(resetDeleteStatus());
        }

    }, [taskDeleteStatus,myStatus]);

    useEffect(() => {

        if ((taskAddMessage!=='')&&(taskAddStatus==='success')&&(myStatus==='success')){
          
            setMessageOpen((taskAddStatus==='success')?0:1, taskAddMessage);
            dispatch(resetAddStatus());
        }

    }, [taskAddStatus,myStatus]);

    useEffect(() => {

        if ((taskUpdateMessage!=='')&&(taskUpdateStatus==='success')&&(myStatus==='success')){
          
            setMessageOpen((taskUpdateStatus==='success')?0:1, taskUpdateMessage);
            dispatch(resetUpdateStatus());
        }

    }, [taskUpdateStatus,myStatus]);


    useEffect(() => {
        dispatch(fetchData());

        dispatch(resetFileName());
    }, []);


    if (myStatus === 'success') 
        return (
            <SimpleLayout>
                <CustomAlert message={showText} type={showType} ref={alertRef} />
                <div className="container p-0">
                    <div className="my-body">


                        <div className="row p-0 g-0 mb-3 mt-3">
                            <div className="col-12 d-flex justify-content-between">
                                <div className="my-body-title roboto-h2">
                                    All AI Tasks
                                </div>

                                <CustomButton onClick={handleClickAdd} disabled={false} name="add" />

                            </div>
                        </div>
                        <div className="row p-0 g-3">
                            {myData.map((item,idx) => (
                                <div className="col-3" key={item.task_uid} style={{paddingBottom:5}} >
                                    <TaskCard
                                        task_uid={item.task_uid}
                                        nameTask={item.task_name}
                                        nameApplication={item.app_name}
                                        nameModel={item.model_name}
                                        nameStatus={item.status}
                                        showMessage={setMessageOpen}
                                    ></TaskCard>
                                </div>
                            ))}
                        </div>

                        {
                            (myData.length === 0) &&
                            <div className="row gy-4" style={{ marginTop: 300 }}>
                                <div className="col-12 d-flex justify-content-center">
                                    <div className='roboto-h2' style={{ color: 'var(--on_color_1)' }}>Ready to start your AI journey?</div>
                                </div>
                            </div>
                        }
                        {
                            (myData.length === 0) &&
                            <div className="row" style={{ marginTop: 15 }}>
                                <div className="col-12 d-flex justify-content-center">
                                    <div className='roboto-h5' style={{ color: 'var(--on_color_2)' }}>Click "Add" at the top right to create your AI task.</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

            </SimpleLayout>
        );

    return (
        <SimpleLayout>
        </SimpleLayout>
    )

}

export default AllAiTasks;
