import '../css/App.css';
import React, { useEffect, useState, useRef } from 'react';
import log from "../utils/console";

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

import { fetchData } from "../store/tasks";
import { resetFileName } from "../store/sources";
import { resetDeleteStatus, resetAddStatus, resetUpdateStatus } from "../store/areas";
import { resetExportStatus, importTask, resetImportStatus, setMessageKey } from "../store/tasks";

import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import ExtendButton from '../components/Buttons/ExtendButton';
import TaskCard from '../components/Cards/TaskCard';
import CustomAlert from '../components/Alerts/CustomAlert';
import WarnningPanel from '../components/Panel/WarnningPanel';
import WebSocketTitle from '../components/WebSockets/WebSocketTitle';
import CustomToast from '../components/Alerts/CustomToast';


function AllAiTasks() {


    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
   
    const alertRef = useRef();
    const fileRef = useRef();
    const toastRef = useRef();

    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myStatus = useSelector((state) => state.tasks.status);

    const taskDeleteMessage = useSelector((state) => state.tasks.deleteMessage);
    const taskDeleteStatus = useSelector((state) => state.tasks.deleteStatus);

    const taskAddMessage = useSelector((state) => state.tasks.addMessage);
    const taskAddStatus = useSelector((state) => state.tasks.addStatus);

    const taskUpdateMessage = useSelector((state) => state.tasks.updateMessage);
    const taskUpdateStatus = useSelector((state) => state.tasks.updateStatus);

    const taskExportMessage = useSelector((state) => state.tasks.exportMessage);
    const taskExportStatus = useSelector((state) => state.tasks.exportStatus);
    const taskImportMessage = useSelector((state) => state.tasks.importMessage);
    const taskImportStatus = useSelector((state) => state.tasks.importStatus);

    const setMessageOpen = (showType, showText) => {

        toastRef.current.setMessage(showType,showText,null);

    };

    const setSnackMessage = (showType, showText, myTaskId) => {

        toastRef.current.setMessage(showType,showText,myTaskId);
    
    };

    const handleClickAdd = () => {

        window.location.href = "/addTask";

    };

    const handleImportClick = () => {
        //setShowImportModal(true);
        fileRef.current.click();
    }

    const handleUploadFile = () => {
        log('handle upload file')
        setShowImportModal(false);
        fileRef.current.click();
    }

    const handleFileChange = (event, value) => {

        log('handle file change')

        if (event.target.files) {

            // dispatch(resetFileName());

            const file = event.target.files[0];
            const formData = new FormData();
            log('--- file name ---')
            log(event.target.files[0])
            formData.append('file', event.target.files[0]);
            formData.append('url', '');
            dispatch(importTask(formData))
            setSnackMessage(2, 'Import task - Waiting (0%)', 'ImportTask')

        }

    };



    const handleImportMessage = (myMessageType, myTaskStatus, myTaskId) => {

        setSnackMessage(myMessageType, myTaskStatus, myTaskId);

        if (myTaskStatus.toLowerCase().indexOf('success') >= 0) {

            setTimeout(() => {
                dispatch(fetchData());
                dispatch(resetFileName());
            }, 1000);
        }
    }

    const handleExportMessage = (myMessageType, myTaskId, myTaskStatus) => {



        const myTaskIndex = myData.findIndex(item => item.task_uid === myTaskId);
        log('myTaskIndex', myTaskIndex)
        const myTaskName = (myTaskIndex === -1) ? 'Export Task' : myData[myTaskIndex].task_name;
        setSnackMessage(myMessageType, `${myTaskName} - ${myTaskStatus}`, myTaskId)

    }

    useEffect(() => {

        if ((taskDeleteMessage !== '') && (taskDeleteStatus === 'success') && (myStatus === 'success')) {

            setMessageOpen((taskDeleteStatus === 'success') ? 0 : 1, taskDeleteMessage);
            dispatch(resetDeleteStatus());
        }

    }, [taskDeleteStatus, myStatus]);

    useEffect(() => {

        if ((taskAddMessage !== '') && (taskAddStatus === 'success') && (myStatus === 'success')) {

            setMessageOpen((taskAddStatus === 'success') ? 0 : 1, taskAddMessage);
            dispatch(resetAddStatus());
        }

    }, [taskAddStatus, myStatus]);

    useEffect(() => {

        if ((taskUpdateMessage !== '') && (taskUpdateStatus === 'success') && (myStatus === 'success')) {

            setMessageOpen((taskUpdateStatus === 'success') ? 0 : 1, taskUpdateMessage);
            dispatch(resetUpdateStatus());
        }

    }, [taskUpdateStatus, myStatus]);

    useEffect(() => {

    
        if ((taskExportMessage.toLowerCase().indexOf('verifying')<0) && (taskExportMessage.toLowerCase() !== '') && (taskExportMessage !== '') && (myStatus === 'success')) {

            setMessageOpen(1, taskExportMessage);

        }

        dispatch(resetExportStatus());

    }, [taskExportStatus, myStatus]);

    useEffect(() => {

        // log('taskImportStatus', taskImportStatus)
        // log('taskImportMessage', taskImportMessage)

        if ((taskImportMessage !== '') && (myStatus === 'success')) {

            setSnackMessage((taskImportStatus.toLowerCase() === 'success') ? 2 : 1, taskImportMessage, 'ImportTask');

        }

        dispatch(resetImportStatus());

    }, [taskImportStatus, myStatus]);


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
                                    <div >
                                        <WebSocketTitle title="All AI Tasks" onImportMessage={handleImportMessage} onExportMessage={handleExportMessage}></WebSocketTitle>
                                    </div>

                                    <div className='d-flex justify-content-between' style={{ width: 76, paddingBottom: 4, paddingRight: 4 }}>
                                        <ExtendButton type={2} onImport={handleImportClick}></ExtendButton>
                                        <CustomButton onClick={handleClickAdd} disabled={false} name="add" />
                                    </div>

                                </div>
                            </div>
                            <div className="row p-0 g-3">
                                {myData.map((item, idx) => (
                                    <div className="col-3" key={item.task_uid} style={{ paddingBottom: 5 }} >
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
               


                <Modal
                    open={showImportModal}
                    onClose={(_event, reason) => {
                        setShowImportModal(false);
                    }}
                >
                    <ModalDialog
                        sx={{ minWidth: 636, maxWidth: 636, minHeight: 456, maxHeight: 456 }}
                    >
                        <div className='container-fluid'>

                            <div className='row'>
                                <div className='col-12'>
                                    <div className='my-select-file-button d-flex justify-content-center align-items-center' onClick={handleUploadFile}>
                                        Select file on local browser
                                    </div>
                                </div>
                            </div>

                        </div>
                    </ModalDialog>
                </Modal>
                <input type="file" name="files" onChange={handleFileChange} ref={fileRef} style={{ visibility: 'hidden', width: '0px', height: '0px' }} />
                <CustomToast ref={toastRef}/>

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

export default AllAiTasks;
