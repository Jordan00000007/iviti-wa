import React, { useState,useRef, useEffect } from 'react';
import log from "../../utils/console";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch } from "react-redux";
import LogPanel from '../../components/Panel/LogPanel';
import { tasksActions } from '../../store/tasks';
import moment from 'moment';

export const WebSocket = (props) => {
    //Public API that will echo messages sent to it back to the client
    const WEBSOCKET_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER;
    
    const wsProtocol=window.location.protocol==="http:"?'ws:':'wss:';
    
    /* important : 直連websocket服務時,url字串最後不能加斜線,使用nginx做proxy連接websocket服務時一定要加斜線 */
    const wsUrl = (WEBSOCKET_SERVER===""?`${wsProtocol}//${window.location.hostname}`:WEBSOCKET_SERVER)+`/ws`+(WEBSOCKET_SERVER===""?"/":"");
    
    //window.location.protocol

    const [socketUrl, setSocketUrl] = useState(wsUrl);
    const [messageHistory, setMessageHistory] = useState([]);
    const {lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);
    const [intervalId, setIntervalId] = useState(null);
    
    const [updateInfo, setUpdateInfo] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {

        if (lastMessage !== null) {

                const myData = JSON.parse(lastMessage.data);

                log('--- myData ---')
                log(myData)

                if (myData.type!==undefined){
                    if (myData.type==="TEMP"){
                        const myTemp=myData.data[props.device].temperature;
                        dispatch(tasksActions.updateTemperatureInfo(myTemp));
                    }
                    if (myData.type==="UID"){
                        
                        const myTask = myData.data.areas;
                        if (myTask){
                            let myNewArr = myTask.concat(messageHistory).slice(0, 9);
                            setMessageHistory(myNewArr);
                            // log('myTask')
                            // log(myTask)
                            log('messageHistory')
                            log(messageHistory)
                            
                        }
                      

                        
                        const duration=moment.duration(myData.data.live_time,'seconds');
                        const minutes=duration.minutes();
                        const hours=duration.hours();
                        const days=duration.days();
                       
                        const myPayload={};
                        myPayload.uuid=props.uuid;
                        myPayload.fps=Math.round(myData.data.fps);
                        myPayload.liveTime=`${days} ${(days>1)?'days':'day'} ${hours} ${(hours>1)?'hours':'hour'} ${minutes} ${(minutes>1)?'mins':'min'}`;

                        dispatch(tasksActions.updateStreamInfo(myPayload));
                        
                       
                    }
                }
        }
    }, [lastMessage]);


    useEffect(() => {
        
       if (updateInfo)
        dispatch(tasksActions.updateStreamInfo(updateInfo));

    },[updateInfo]);

    useEffect(() => {
        
        let timer=null;

        if (props.status==='running'){
  
            timer=setInterval(() => {

                let myData={};

                myData.type="TEMP";
                myData.data=[props.device];
                sendMessage(JSON.stringify(myData));

                myData.type="UID";
                myData.data=props.uuid;
                sendMessage(JSON.stringify(myData));

            }, 3000);

           


            setIntervalId(timer);

        }else{
            clearInterval(intervalId);
            setIntervalId(null);
        }

        return () => clearInterval(timer);
 
     },[props]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <LogPanel data={messageHistory} status={props.status} /> 
        </div>
    );
};