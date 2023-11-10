import InfoIcon from '@mui/icons-material/Info';
import log from "../../utils/console";
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import React, { useState, useEffect,useImperativeHandle,forwardRef  } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { findKey,findIndex,pickBy,startsWith } from 'lodash-es';
import { getAllModels, importModel, deleteModel, deleteProcess, resetProcessStatus } from "../../store/models";

import { ReactComponent as IconSuccess } from '../../assets/Feedback_Icon_Success.svg';
import { ReactComponent as IconFail } from '../../assets/Feedback_Icon_Fail.svg';
import { ReactComponent as IconLoading } from '../../assets/Feedback_Icon_Loading.svg';

const ProgressAlert = forwardRef((props, ref) => {

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState(0);
    const [interval, setInterval] = useState(3000);
    const containerRef = React.useRef(null);
    const iconArr = [<IconSuccess />, <IconFail />, <IconLoading />]

    const WEBSOCKET_SERVER = process.env.REACT_APP_WEBSOCKET_SERVER;
    const wsProtocol=window.location.protocol==="http:"?'ws:':'wss:'; 
    /* important : 直連websocket服務時,url字串最後不能加斜線,使用nginx做proxy連接websocket服務時一定要加斜線 */
    const wsUrl = (WEBSOCKET_SERVER===""?`${wsProtocol}//${window.location.hostname}:${window.location.port}`:WEBSOCKET_SERVER)+`/ws`+(WEBSOCKET_SERVER===""?"/":"");
    const [socketUrl, setSocketUrl] = useState(wsUrl);
    const [messageHistory, setMessageHistory] = useState([]);
    const {lastMessage, readyState, sendMessage } = useWebSocket(socketUrl);
    const processUid = useSelector((state) => state.models.importUid);

    const dispatch = useDispatch();

    useEffect(() => {

        setMessage(props.message);

    }, [props.message]);

    useEffect(() => {

        setType(props.type);

    }, [props.type]);

    useEffect(() => {

        if (lastMessage !== null) {

            const myData = JSON.parse(lastMessage.data);
            log('------- processUid ------')
            log(processUid)
            if (processUid!==''){
                
                log(findKey(myData.data,processUid))
                const myResult = pickBy(myData.data, (value, key) => {
                    return startsWith(key, processUid);
                });

                //log('------- ws message ------')
                //log(myResult)
               
                const myStatus =myResult[processUid].status.toString().toLowerCase();
                const myMessage =myResult[processUid].message;
                if (myStatus==='success'){
                    setType(0);
                    setMessage(`Import model ${myStatus}.`);
                    dispatch(deleteProcess(processUid));
                    dispatch(getAllModels());
                    setTimeout(() => {
                        setShow(false);
                        setType(0);
                        setMessage('');
                       
                    }, interval); 
                    dispatch(resetProcessStatus());
                }else if (myStatus==='failure'){
                    setType(1);
                    setMessage(`Import model ${myStatus} : ${myMessage}`);
                    dispatch(deleteProcess(processUid));
                    dispatch(getAllModels());
                    setTimeout(() => {
                        setShow(false);
                        setType(0);
                        setMessage('');
                       
                    }, interval*2); 
                    dispatch(resetProcessStatus());
                }
                else{
                    setType(2);
                    setMessage(`Import model ${myStatus}...`)
                }
                
            }
            
            //log('------- ws data ------')
            //log(myData)
                
        }
    }, [lastMessage,processUid]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    


    useImperativeHandle(ref, () => ({
        setShowTrue: (myInterval) => {
            setShow(true);
            if (myInterval===undefined) myInterval=interval;
            setTimeout(() => {
                setShow(false);
               
            }, myInterval); 
        },
        setShowKeep: () => {
            setShow(true);
        },
        setShowClose: () => {
            setShow(false);
        },
        setType: (myType) => {
            setType(myType);
        },
        setMessage: (myMessage) => {
            setMessage(myMessage);
        }
    }));

    return (
        
        <Box sx={{ display: 'flex', gap: 0, flexDirection: 'column', zIndex: 5}} className='my-alert-message' ref={containerRef} style={{ display: show ? 'block' : 'none',paddingTop:'0px' }}>         
                <Alert
                    sx={{ alignItems: 'flex-between',  width: '1200px', backgroundColor: 'var(--on_color_1)', color: '#F8F8F8' }}
                    startDecorator={React.cloneElement(iconArr[type], {
                        style: { position: 'relative', top: '0px'},
                        className:(type===2)?'rotating-svg':''
                    })}
                    variant="soft"
                    
                >
                    <div className='roboto-b1 mt-1' >
                        {message}
                    </div>
                </Alert>
        </Box>
    );
});


export default ProgressAlert