import React, { useState, useRef, useEffect  } from 'react';
import log from "../../utils/console";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch,useSelector } from "react-redux";
import LogPanel from '../../components/Panel/LogPanel';
import { tasksActions } from '../../store/tasks';
import {filter,matches,find} from 'lodash-es'
import moment from 'moment';
import fileDownload from 'js-file-download';
import axios  from 'axios';

const WebSocketTitle = (props) => {
    //Public API that will echo messages sent to it back to the client
    const WEBSOCKET_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER;
    const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;

    const FILE_URL = `${TASK_SERVER}/files`;

    const wsProtocol = window.location.protocol === "http:" ? 'ws:' : 'wss:';

    const myTaskData = useSelector((state) => state.tasks.data);

    /* important : 直連websocket服務時,url字串最後不能加斜線,使用nginx做proxy連接websocket服務時一定要加斜線 */
    const wsUrl = (WEBSOCKET_SERVER === "" ? `${wsProtocol}//${window.location.hostname}:${window.location.port}` : WEBSOCKET_SERVER) + `/ws` + (WEBSOCKET_SERVER === "" ? "/" : "");

    //window.location.protocol

    //log('wsUrl',wsUrl)

    const [socketUrl, setSocketUrl] = useState(wsUrl);
    const [messageHistory, setMessageHistory] = useState([]);
    const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
        onOpen: () => {
            log('ws open')
        },
        shouldReconnect: (closeEvent) => true,
    });

    const [updateInfo, setUpdateInfo] = useState(null);

    const dispatch = useDispatch();

    const download=(myUrl, myFilename, myTaskId)=> {

        // axios.get(myUrl, {
        //     responseType: 'blob',
        // }).then(res => {
        //     props.onExportMessage(0,myTaskId,`Download success`)
        //     fileDownload(res.data, myFilename);
            
        // });

        // const link = document.createElement('a');
        // link.target = '_blank';
        // link.rel = 'noopener noreferrer';
        // link.href = myUrl;
        // link.click();

        const link = document.createElement('a');
        link.href = myUrl;
        link.setAttribute(
        'download',
        myFilename,
        );
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
    }

    useEffect(() => {

        if (lastMessage !== null) {

            const myData = JSON.parse(lastMessage.data);


            log('--- myData ---')
            log(myData)

            if (myData.type !== undefined) {
                if (myData.type === "PROC") {

                    // const myExportData=filter(myData.data, matches({ 'action': 'EXPORT', 'topic': 'TASK' }));

                    // Object.keys(myExportData.data).forEach(myKey => {

                    //     const taskId = myKey;
 
                    //     if (myExportData.length>0){
                           
                    //         props.onMessage(2, taskId, (myExportData[0].status==='Success')?'Downloading':myExportData[0].status);
                    //         if (myExportData[0].status === 'Success') {
                    //             download(`${FILE_URL}/${myExportData[0].zip_name}`, myExportData[0].zip_name, taskId)
                    //         }
                    //     }
                    // })

                    const myImportData=find(myData.data,{ 'action': 'IMPORT', 'topic': 'TASK' });

                    log('myImportData',myImportData)

                    Object.keys(myData.data).forEach(myKey => {

                        const taskId = myKey;

                        if ((myData.data[myKey].action==='IMPORT')&&(myData.data[myKey].topic==='TASK')){
                            if (myData.data[myKey].status.toLowerCase()==='success'){
                                props.onImportMessage(0, myData.data[myKey].name , myData.data[myKey].status);
                            }else{
                                props.onImportMessage(2, myData.data[myKey].name , myData.data[myKey].status);
                            }
                            
                        }

                        if ((myData.data[myKey].action==='EXPORT')&&(myData.data[myKey].topic==='TASK')){
                            props.onExportMessage((myData.data[myKey].status==='Success')?0:2, taskId, myData.data[myKey].status);
                            if (myData.data[myKey].status === 'Success') {

                                log('download link ===')
                                log(`${FILE_URL}/${myData.data[myKey].zip_name}`)
                                download(`${FILE_URL}/${myData.data[myKey].zip_name}`, myData.data[myKey].zip_name, taskId)
                            }
                        }
 
                        

                        // if (myImportData.length>0){
                        //    log('-------export status-------')
                        //    log(taskId,myImportData[0].status)
                        //     props.onMessage(2, taskId, myImportData[0].status);
                            
                        // }

                    })

                        
                     
                      
                  

                }
            }
        }
    }, [lastMessage]);


    useEffect(() => {



    }, []);



    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div className="my-body-title roboto-h2">
            {props.title}
        </div>
    );
};

export default WebSocketTitle;