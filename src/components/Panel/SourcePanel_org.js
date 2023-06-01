import React, { useState, useRef, useEffect } from 'react';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomInput from '../../components/Inputs/CustomInput';
import RtspInput from '../../components/Inputs/RtspInput';
import CustomSelect from '../../components/Dropdowns/CustomSelect';
import { uploadSourceData,getV4l2Devices,resetErrorMessage,resetFileName } from "../../store/sources";

import { useSelector, useDispatch } from "react-redux";
import CustomAlert from '../../components/Alerts/CustomAlertSmall';


const SourcePanel = (props) => {

    const [typeRTSP, setTypeRTSP] = useState(true);
    const [typeV4L2, setTypeV4L2] = useState(false);
    const [source, setSource] = useState('');
    const fileRef = useRef(null);
    const formRef = useRef(null);

    const v4l2Options = useSelector((state) => state.sources.v4l2Options);
    const errorMessage = useSelector((state) => state.sources.error);

    const dispatch = useDispatch();

    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');
    const [rtspSubmit, setRtspSubmit] = useState(false);
    const [rtspUrl, setRtspUrl] = useState('');
    const alertRef = useRef();

    const handleTypeRTSPClick = () => {
        log('rtsp click');
        setTypeRTSP(true);
        setTypeV4L2(false);
    }

    const handleTypeV4L2Click = () => {
        log('v4l2 click');
        setTypeRTSP(false);
        setTypeV4L2(true);
        dispatch(getV4l2Devices())
    }

    const handleUploadClick = () => {
        log('upload click');
        fileRef.current.click();
    }

    const handleFileChange = (e) => {
        log('file change');
        
        if (e.target.files) {

            dispatch(resetFileName());
           
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('files', e.target.files[0]);
            dispatch(uploadSourceData(formData))

        }
        
    }


    const handleRtspSubmit= (event) => {
      
        log('rtsp submit');
        log( `rtsp://${rtspUrl}`)
        const formData = new FormData();
        formData.append('input', `rtsp://${rtspUrl}`);
        dispatch(uploadSourceData(formData))

    }

    const handleInputChange=(event)=>{
       
        (event.target.value==='')?setRtspSubmit(false): setRtspSubmit(true);
        setRtspUrl(event.target.value);
    }


    useEffect(() => {

        //log(errorMessage)
        if(errorMessage){
            if (errorMessage!==''){
                setShowType(1);
                setShowText(errorMessage);
                alertRef.current.setShowTrue();
                dispatch(resetErrorMessage());
            }
        }
     

    }, [errorMessage]);




    return (
        <div className='my-source-panel position-absolute top-100 start-0' >
            <div style={{position:'relative'}}>
            <CustomAlert message={showText} type={showType} ref={alertRef} width="375" height="18"/>
            <div  style={{position:'absolute',width:499,top:0}}>
                <ul className="nav nav-tabs flex-nowrap" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="my-nav-link-s active roboto-b1" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true">Camera</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="my-nav-link-s roboto-b1" id="log-tab" data-bs-toggle="tab" data-bs-target="#log" type="button" role="tab" aria-controls="log" aria-selected="false">Upload</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                        <div className='my-tab-container-sx '>

                            <div className="row mb-3">
                                <div className="col-12 d-flex justify-content-start gap-2">
                                    <LabelButton name="RTSP" width="56" height="24" className={typeRTSP ? "my-source-panel-type-active" : "my-source-panel-type-inactive"} onClick={handleTypeRTSPClick} />
                                    <LabelButton name="V4L2" width="56" height="24" className={typeV4L2 ? "my-source-panel-type-active" : "my-source-panel-type-inactive"} onClick={handleTypeV4L2Click} />
                                </div>
                            </div>
                            {
                                typeRTSP &&
                                <div className="row ">
                                    <div className="col-12 d-flex justify-content-between gap-2">
                                        <RtspInput defaultValue="" onChange={handleInputChange}/>
                                        <LabelButton name="Submit" className={rtspSubmit?"my-source-panel-submit-enable":"my-source-panel-submit-disable"} width="85" height="32" onClick={handleRtspSubmit} />
                                    </div>
                                </div>
                            }
                            {
                                typeV4L2 &&
                                <div className="row ">
                                    <div className="col-12 d-flex justify-content-between">
                                        <CustomSelect areaArr={v4l2Options} width="395" height="32" fontSize="16" placeHolder={true}></CustomSelect>
                                    </div>
                                </div>

                            }


                        </div>
                    </div>
                    <div className="tab-pane fade" id="log" role="tabpanel" aria-labelledby="log-tab">
                        <div className='my-tab-container-sx'>
                            <div className="row mb-3">
                                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '120px' }}>
                                    <LabelButton name="Upload" width="85" height="32" className="my-source-panel-upload" onClick={handleUploadClick} />

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '0px' }}>
                                    
                                        <input type="file" name="files" onChange={handleFileChange} ref={fileRef} style={{ visibility: 'hidden' }} />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default SourcePanel;