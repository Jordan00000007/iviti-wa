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

    const [socketUrl, setSocketUrl] = useState(wsUrl);
    const [messageHistory, setMessageHistory] = useState([]);
    const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
        onOpen: () => {
            log('ws open =>',socketUrl)
        },
        shouldReconnect: (closeEvent) => true,
    });

    const [updateInfo, setUpdateInfo] = useState(null);

    const dispatch = useDispatch();

    const download=(myUrl, myFilename, myTaskId)=> {

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

            if (myData.type !== undefined) {
                if (myData.type === "PROC") {

                   

                    const myImportData=find(myData.data,{ 'action': 'IMPORT', 'topic': 'TASK' });

        
                    Object.keys(myData.data).forEach(myKey => {

                        const taskId = myKey;

                        if ((myData.data[myKey].action==='IMPORT')&&(myData.data[myKey].topic==='TASK')){
                            if (myData.data[myKey].status.toLowerCase().indexOf('success')>=0){
                                props.onImportMessage(0, 'Import task - '+ myData.data[myKey].status,'ImportTask');
                            }else{
                                props.onImportMessage(2, 'Import task - '+ myData.data[myKey].status,'ImportTask');
                            }
                            
                        }

                        if ((myData.data[myKey].action==='EXPORT')&&(myData.data[myKey].topic==='TASK')){
                            props.onExportMessage((myData.data[myKey].status.toLowerCase().indexOf('success')>=0)?0:2, taskId, myData.data[myKey].status);
                            if (myData.data[myKey].status.toLowerCase().indexOf('success')>=0) {

                                log('download link ===')
                                log(`${FILE_URL}/${myData.data[myKey].zip_name}`)
                                download(`${FILE_URL}/${myData.data[myKey].zip_name}`, myData.data[myKey].zip_name, taskId)
                            }
                        }
 
                        

                   

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