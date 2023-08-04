import React, { useState, useRef, useEffect } from 'react';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomLoadingSmall from '../../components/Loading/CustomLoadingSmall';
import RtspInput from '../../components/Inputs/RtspInput';
import CustomSelectDevice from '../../components/Dropdowns/CustomSelectDevice';
import { uploadSourceData, getV4l2Devices, resetErrorMessage, resetFileName,resetV4l2Status } from "../../store/sources";

import { useSelector, useDispatch } from "react-redux";
import CustomAlertSmall from '../../components/Alerts/CustomAlertSmall';
import CustomInput from '../Inputs/CustomInput';

import { includes } from 'lodash-es';

const SourcePanel = (props) => {

    const [typeRTSP, setTypeRTSP] = useState(true);
    const [typeV4L2, setTypeV4L2] = useState(false);
    const [source, setSource] = useState('');
    const fileRef = useRef(null);


    const cameraRef = useRef();
    const uploadRef = useRef();
    const rtspRef = useRef();
    const v4l2Ref = useRef();
    const v4l2SelectorRef = useRef();
    const rtspInputRef = useRef();

    const v4l2Options = useSelector((state) => state.sources.v4l2Options);
    const v4l2Status = useSelector((state) => state.sources.v4l2Status);
    const errorMessage = useSelector((state) => state.sources.error);
    const type = useSelector((state) => state.sources.type);
    const fileName = useSelector((state) => state.sources.fileName);

    const dispatch = useDispatch();

    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');
    const [showInterval, setShowInterval] = useState(3000);
    const [rtspSubmit, setRtspSubmit] = useState(false);
    const [rtspUrl, setRtspUrl] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(false);
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

    const handleClearClick = () => {
        log('clear click');
        dispatch(resetFileName());
        props.onClose();

    }

    const handleFileChange = (e) => {
        log('file change');
        log(e.target.files)

        if (e.target.files) {

            dispatch(resetFileName());

            const fileName = e.target.files[0].name;

            const fileExtension = fileName.toString().split('.').pop().toLowerCase();

            const supportType=['jpg','jpeg','png','tiff','tif','bmp','mp4','avi','mov','wmv'];

            log('fileName')
            log(fileName)

            log('fileExtension')
            log(fileExtension)

            log('support?')
            log()

            if (includes(supportType,fileExtension)){
                const formData = new FormData();
                formData.append('files', e.target.files[0]);
                dispatch(uploadSourceData(formData))
                setUploadLoading(true);
            }else{
                setShowType(1);
                setShowText('Not support file type.');
                setShowInterval(3000);
                alertRef.current.setShowTrue();
            }


           

        }

    }


    const handleRtspSubmit = (event) => {

        log('rtsp submit');
        log(`rtsp://${rtspUrl}`)
        log(event.target.innerText)
      
            if (event.target.innerText==='Clear'){
                dispatch(resetFileName());
                props.onClose();
            }else{
                if (rtspSubmit) {
                    const formData = new FormData();
                    formData.append('input', `rtsp://${rtspUrl}`);
                    dispatch(uploadSourceData(formData));
                    setCameraLoading(true);
                }
            }
        }


    

    const handleInputChange = (event) => {

        (event.target.value === '') ? setRtspSubmit(false) : setRtspSubmit(true);
        setRtspUrl(event.target.value);
    }

    const handleV4l2Selected = (event, value) => {

        log('handle V4l2 Selected');
        if ((value !== null)&&(value!==fileName)) {
            const formData = new FormData();
            formData.append('input', value);
            dispatch(uploadSourceData(formData));

            setCameraLoading(true);
        }

    }

    const handleSourcePanelClick = (event, value) => {

        event.stopPropagation();
    }

    const handleV4l2Click= (event) => {

        log('handle v4l2 click')
        v4l2SelectorRef.current.setSelectedValue('');
        dispatch(getV4l2Devices())
    }


 
    useEffect(() => {

        log('cameraLoading')
        log(cameraLoading)
        log(uploadRef.current.disabled)

        log('uploadLoading')
        log(uploadLoading)


    }, [cameraLoading,uploadLoading]);
    


    useEffect(() => {

        //log(errorMessage)
        fileRef.current.value = "";
        if (errorMessage) {
            if (errorMessage !== '') {
                setUploadLoading(false);
                setCameraLoading(false);
                setShowType(1);
                setShowText(errorMessage);
                setShowInterval(6000);
                alertRef.current.setShowTrue();
                dispatch(resetErrorMessage());
            }
        }


    }, [errorMessage]);

    useEffect(() => {

        if (type === 'IMAGE') {
            uploadRef.current.click();
        }
        if (type === 'VIDEO') {
            uploadRef.current.click();
        }
        if (type === 'CAM') {
            cameraRef.current.click();
            v4l2Ref.current.setButtonClick();
            //v4l2SelectorRef.current.setSelectedValue(fileName);

        }
        if (type === 'RTSP') {
            cameraRef.current.click();
            rtspRef.current.setButtonClick();
        }



    }, []);

    useEffect(() => {

        if ((typeV4L2)&&(fileName!=='')&&(v4l2Status==='success')&&(type==='CAM')){
            
           
            if (v4l2SelectorRef.current){
                v4l2SelectorRef.current.setSelectedValue(fileName);
                dispatch(resetV4l2Status());
            }
        }


    }, [typeV4L2, fileName, v4l2Status,type]);

    useEffect(() => {

        log('fileName----------')
        log(fileName)

        if ((typeRTSP)&&(fileName!=='')&&(type==='RTSP')&&(fileName!==null)){
            
            //rtspInputRef.current.setInputValue(fileName.replace("rtsp://",""));
            if (rtspInputRef.current){
                rtspInputRef.current.setInputValue(fileName.replace("rtsp://",""));
            }
           
        }


    }, [typeRTSP, fileName ,type]);










    return (
        <div className='my-source-panel position-absolute top-100 start-0' onClick={handleSourcePanelClick}>
           
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', width: 496,height: 250, top: 3, left: 3 }} className='d-flex align-items-end justify-content-center p-2'>
                    <CustomAlertSmall message={showText} type={showType} ref={alertRef} interval={showInterval} width="375" height="18" />
                </div>
                <div style={{ position: 'absolute', width: 499, top: 0 }}>
                    <ul className="nav nav-tabs flex-nowrap" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="my-nav-link-s active roboto-b1" id="info-tab" data-bs-toggle="tab" data-bs-target="#info" type="button" role="tab" aria-controls="info" aria-selected="true" ref={cameraRef} disabled={uploadLoading}>Camera</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="my-nav-link-s roboto-b1" id="log-tab" data-bs-toggle="tab" data-bs-target="#log" type="button" role="tab" aria-controls="log" aria-selected="false" ref={uploadRef} disabled={cameraLoading}>Upload</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                            <div className='my-tab-container-sx '>

                                {
                                    (!cameraLoading) &&

                                    <>
                                        <div className="row mb-3">
                                            <div className="col-12 d-flex justify-content-start gap-2">
                                                <LabelButton name="RTSP" width="56" height="24" className={typeRTSP ? "my-source-panel-type-active" : "my-source-panel-type-inactive"} onClick={handleTypeRTSPClick} ref={rtspRef} />
                                                <LabelButton name="V4L2" width="56" height="24" className={typeV4L2 ? "my-source-panel-type-active" : "my-source-panel-type-inactive"} onClick={handleTypeV4L2Click} ref={v4l2Ref} />
                                            </div>
                                        </div>
                                        {
                                            typeRTSP &&
                                            <div className="row ">
                                                <div className="col-12 d-flex justify-content-between gap-2">
                                                    <RtspInput defaultValue="" onChange={handleInputChange} ref={rtspInputRef}/>
                                                    <LabelButton name={(fileName==='')?"Submit":"Clear"} className={(fileName==='')?(rtspSubmit ? "my-source-panel-submit-enable" : "my-source-panel-submit-disable"):"my-source-panel-clear-enable"} width="85" height="32" onClick={handleRtspSubmit} />
                                                </div>
                                            </div>
                                        }
                                        {
                                            typeV4L2 &&
                                            <div className="row ">
                                                <div className="col-12 d-flex justify-content-between">
                                                    <CustomSelectDevice areaArr={v4l2Options} width="395" height="32" fontSize="16" placeHolder={true} onChange={handleV4l2Selected} ref={v4l2SelectorRef} onClick={handleV4l2Click} ></CustomSelectDevice>
                                                </div>
                                            </div>

                                        }
                                    </>
                                }
                                {
                                    cameraLoading &&
                                    <div className="row">
                                        <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: 120 }}>
                                            <CustomLoadingSmall />
                                        </div>
                                    </div>
                                }


                            </div>
                        </div>
                        <div className="tab-pane fade" id="log" role="tabpanel" aria-labelledby="log-tab">
                            <div className='my-tab-container-sx'>
                                <div className="row mb-3">
                                    <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '120px', paddingLeft: 0, paddingRight: 0 }}>
                                        {
                                            (!uploadLoading) &&
                                            <>
                                                {
                                                    ((fileName === '')||(type==='CAM')||(type==='RTSP')) &&
                                                    <LabelButton name="Upload" width="85" height="32" className="my-source-panel-upload" onClick={handleUploadClick} />
                                                }
                                                {
                                                    (fileName !== '')&&((type==='VIDEO')||(type==='IMAGE')) &&
                                                    <div className='d-flex justify-content-between' style={{ width: 396 }}>
                                                        <CustomInput width="300" height="32" disabled={true} defaultValue={fileName}></CustomInput>
                                                        <LabelButton name="Clear" width="85" height="32" className="my-source-panel-clear roboto-b1" onClick={handleClearClick} />
                                                    </div>
                                                }
                                            </>

                                        }

                                        {
                                            uploadLoading &&
                                            <CustomLoadingSmall />
                                        }


                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 d-flex justify-content-center align-items-center" style={{ height: '0px' }}>

                                        <input type="file" name="files" onChange={handleFileChange} ref={fileRef} style={{ visibility: 'hidden' }} accept=".jpg,.jpeg,.png,.tiff,.tif,.bmp,.mp4,.avi,.mov,.wmv"/>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SourcePanel;