import InfoIcon from '@mui/icons-material/Info';
import log from "../../utils/console";
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import React, { useState, useEffect,useImperativeHandle,forwardRef  } from 'react';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';

import Slide from '@mui/material/Slide';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOff from '@mui/icons-material/HighlightOff';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';

import { ReactComponent as IconSuccess } from '../../assets/Feedback_Icon_Success.svg';
import { ReactComponent as IconFail } from '../../assets/Feedback_Icon_Fail.svg';
import { ReactComponent as IconLoading } from '../../assets/Feedback_Icon_Loading.svg';



const CustomAlert = forwardRef((props, ref) => {

    const [show, setShow] = useState(false);
  
    const containerRef = React.useRef(null);

    const iconArr = [<IconSuccess />, <IconFail />, <IconLoading />]



    useImperativeHandle(ref, () => ({
        setShowTrue: () => {
            setShow(true);
        }
    }));

   
    useEffect(() => {

        const timer = setTimeout(() => {
            setShow(false);
           
        }, 1500); // 設定計時器時間為 3 秒

        return () => clearTimeout(timer); // 記得清除計時器以避免記憶體洩漏
    }, [props.message]);

    return (
        
        <Box sx={{ display: 'flex', gap: 0, flexDirection: 'column', zIndex: 5}} className='my-alert-message' ref={containerRef} style={{ display: show ? 'block' : 'none',height:'76px' }}>         
                <Alert
                    sx={{ alignItems: 'flex-start', width: '1200px', height: '44px', backgroundColor: 'var(--on_color_1)', color: '#F8F8F8' }}
                    startDecorator={React.cloneElement(iconArr[props.type], {
                        style: { position: 'relative', top: '-5px'}
                    })}
                    variant="soft"
                >
                    <div className='roboto-b1'>
                        {props.message}
                    </div>
                </Alert>
        </Box>
    );
});


export default CustomAlert