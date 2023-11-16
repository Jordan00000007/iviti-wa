import '../css/App.css';
import React, { useEffect, useState, useRef } from 'react';
import log from "../utils/console";

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { SnackbarProvider, enqueueSnackbar,closeSnackbar } from 'notistack';
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
import CustomSnackbar from '../components/Alerts/CustomSnackbar';


function AllAiTasks() {


    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');
    const [showImportModal, setShowImportModal] = useState(false);
    const [importTaskMessageKey, setImportTaskMessageKey] = useState(null);

    const alertRef = useRef();
    const fileRef = useRef();

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

        // setShowType(showType);
        // setShowText(showText);
        // alertRef.current.setShowTrue(3000);

        //setSnackMessage(showType, showText)

        const myKey=enqueueSnackbar('null', {
            // STEP 4：content 的地方帶入客製化樣式，裡面可以帶入客製化資料（data）
            content: CustomSnackbar({
                type: showType,
                msg: showText,
            }),

        });

    };

    const setSnackMessage = (showType, showText,myTaskId) => {

        log('myTaskId',myTaskId)

        const myTaskIndex = myData.findIndex(item => item.task_uid === myTaskId);
        log('myTaskIndex',myTaskIndex)

        if (myTaskIndex>=0){
            const myPrevKey=(typeof myData[myTaskIndex].messageKey == "undefined")?null:myData[myTaskIndex].messageKey;
            if (myPrevKey>0) closeSnackbar(myPrevKey)
        }

        if (myTaskId==='Import task'){
            if (importTaskMessageKey!==null) closeSnackbar(importTaskMessageKey)
        }

        //log('typeof myData[myTaskIndex].messageKey',typeof myData[myTaskIndex].messageKey)

       
       


        const myKey=enqueueSnackbar('null', {
            // STEP 4：content 的地方帶入客製化樣式，裡面可以帶入客製化資料（data）
            content: CustomSnackbar({
                type: showType,
                msg: showText,
            }),

        });

        if (myTaskIndex>=0){
            dispatch(setMessageKey({task_uid:myTaskId,key:myKey}))
        }
        if (myTaskId==='Import task'){
            setImportTaskMessageKey(myKey)
        }
       

        log('--- my key ---')
        log(myKey)


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
            setSnackMessage(2,'Import task - Start','Import task')

        }

    };



    const handleImportMessage = (myMessageType, myTaskName, myTaskStatus) => {

        setSnackMessage(myMessageType, `Import task - ${myTaskStatus}`,'Import task');

        if (myTaskStatus.toLowerCase()==='success'){

            setTimeout(() => {
                dispatch(fetchData());
                dispatch(resetFileName());
              }, 3000); 
        }
    }

    const handleExportMessage = (myMessageType, myTaskId, myTaskStatus) => {

        const myTaskIndex = myData.findIndex(item => item.task_uid === myTaskId);
        log('myTaskIndex',myTaskIndex)
        const myTaskName = (myTaskIndex===-1)?'Export Task':myData[myTaskIndex].task_name;
        setSnackMessage(myMessageType, `${myTaskName} - ${myTaskStatus}`,myTaskId)

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

        log('taskExportStatus', taskExportStatus)
        log('taskExportMessage', taskExportMessage)

        if ((taskExportMessage.toLowerCase() !== 'Verifying')&&(taskExportMessage.toLowerCase() !== '') && (taskExportStatus.toLowerCase() !== 'success') && (myStatus === 'success')) {

            setMessageOpen(1, taskExportMessage);
           
        }

        dispatch(resetExportStatus());

    }, [taskExportStatus, myStatus]);

    useEffect(() => {

        // log('taskImportStatus', taskImportStatus)
        // log('taskImportMessage', taskImportMessage)

        if ((taskImportMessage !== '') && (myStatus === 'success')) {
           
            setSnackMessage((taskImportStatus.toLowerCase()==='success')?2:1, taskImportMessage,'Import task');
            
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
                <SnackbarProvider anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} autoHideDuration={3000} >
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
                </SnackbarProvider>



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
