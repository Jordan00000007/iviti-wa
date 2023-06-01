import React, { useState, useCallback, useEffect, useImperativeHandle } from 'react';
import log from "../../utils/console";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useDispatch } from "react-redux";
import LogPanel from '../../components/Panel/LogPanel';
import { tasksActions } from '../../store/tasks';
import moment from 'moment';

export const WebSocket = (props) => {
    //Public API that will echo messages sent to it back to the client
    const WEBSOCKET_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER;
    const wsUrl = `${WEBSOCKET_SERVER}/results`;
    const [socketUrl, setSocketUrl] = useState(wsUrl);
    const [messageHistory, setMessageHistory] = useState([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const [updateInfo, setUpdateInfo] = useState(null);

    const dispatch = useDispatch();
  
    useEffect(() => {

        if (lastMessage !== null) {

            setMessageHistory((prev) => {

                //prev.concat(lastMessage)
                const myData = JSON.parse(lastMessage.data);

                if (myData[props.uuid]) {
                    const myTask = JSON.parse(myData[props.uuid]);
                 
                    let payload={};
                    payload.uuid=props.uuid;
                    payload.fps=myTask.fps;
                    const duration=moment.duration(myTask.live_time,'seconds');
                    const minutes=duration.minutes();
                    const hours=duration.hours();
                    const days=duration.days();
                    payload.liveTime=`${days} ${(days>1)?'days':'day'} ${hours} ${(hours>1)?'hours':'hour'} ${minutes} ${(minutes>1)?'mins':'min'}`;

                   
                    setUpdateInfo(payload);
                 
                    const myNewArr = [myTask].concat(prev).slice(0, 9);
                    return myNewArr;

                } else {
                    return [];
                }


            });
            
        }
    }, [lastMessage, setMessageHistory]);


    useEffect(() => {
        
       if (updateInfo)
        dispatch(tasksActions.updateStreamInfo(updateInfo));

    },[updateInfo]);

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