import InfoIcon from '@mui/icons-material/Info';
import log from "../../utils/console";
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import React, { useState, useEffect,useImperativeHandle,forwardRef  } from 'react';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import CustomTooltip from '../Tooltips/CustomTooltip';

import CircularProgress from '@mui/joy/CircularProgress';
import Warning from '@mui/icons-material/Warning';

import Slide from '@mui/material/Slide';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOff from '@mui/icons-material/HighlightOff';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';

import { ReactComponent as IconSuccess } from '../../assets/Feedback_Icon_Success.svg';
import { ReactComponent as IconFail } from '../../assets/Feedback_Icon_Fail.svg';
import { ReactComponent as IconLoading } from '../../assets/Feedback_Icon_Loading.svg';



const CustomAlertSmall = forwardRef((props, ref) => {

    const [show, setShow] = useState(false);
    const [interval, setInterval] = useState(3000);
  
    const containerRef = React.useRef(null);

    const iconArr = [<IconSuccess />, <IconFail />, <IconLoading />]



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
        }
    }));

   
    useEffect(() => {

        const timer = setTimeout(() => {
            setShow(false);
           
        }, props.interval); // 設定計時器時間為 3 秒

        return () => clearTimeout(timer); // 記得清除計時器以避免記憶體洩漏
    }, [props]);

    return (

        
        <Box sx={{ display: 'flex', gap: 0, flexDirection: 'column', zIndex: 5}} className='my-alert-message-v2' ref={containerRef} style={{ display: show ? 'block' : 'none',paddingTop:'0px' }}>         
                <Alert
                    sx={{ alignItems: 'flex-start'}}
                    startDecorator={
                        
                        React.cloneElement(iconArr[props.type], {style: { position: 'relative', top: '-5px',left:'5px'},className: (props.type===2)?'rotating-svg':''})
                       
                    }
                    
                    variant="soft"
                    slotProps={{
                        root: {
                            sx: {
                                // top: '-4px !important',
                                // height:parseInt(props.height)*5,
                                color: '#F8F8F8',
                                backgroundColor: 'var(--on_color_1)',
                              
                                width:395,
                                padding:0,
                            }
                        },
                        startDecorator:{
                            sx:{
                                width:23,
                                height:23,
                            }
                        }
                    }}
                
                    
                >
                    <div className='roboto-b2'>
                        
                            {props.message}
                        
                    </div>
                </Alert>
        </Box>
    );
});


export default CustomAlertSmall