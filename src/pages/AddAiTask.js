import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';

import CustomInput from '../components/Inputs/CustomInput';
import LinePanel from '../components/Panel/LinePanel';
import CustomDrawing from '../components/Drawing/CustomDrawing';

import { useSelector, useDispatch } from "react-redux";

import { getAllDevices } from "../store/devices";
import { getAllModels } from "../store/models";
import { getAllApplications } from "../store/applications";
import { addTask } from "../store/tasks";
import { initData, setDependOn } from "../store/areas";

import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import { Image } from "react-konva";
import useImage from "use-image"


import log from "../utils/console";
import search from "../utils/search";

import CustomSelect from '../components/Dropdowns/CustomSelect';
import CustomSelectArea from '../components/Dropdowns/CustomSelectArea';
import CustomSelectSource from '../components/Dropdowns/CustomSelectSource';
import Sample from '../assets/sample.png';

import { ReactComponent as ToolIcon_Point } from '../assets/Icon_Point.svg';
import { ReactComponent as ToolIcon_Pen } from '../assets/Icon_Pen.svg';
import { ReactComponent as ToolIcon_Pen_Add } from '../assets/Icon_Pen_Add.svg';
import { ReactComponent as ToolIcon_Line } from '../assets/Icon_Line.svg';
import { ReactComponent as ToolIcon_Delete } from '../assets/Icon_Delete.svg';
import { ReactComponent as ToolIcon_Confirm } from '../assets/Icon_Confrim.svg';
import { ReactComponent as Image_Default } from '../assets/Image_Default.svg';

import SourcePanel from '../components/Panel/SourcePanel';
import DependOnSelectPanel from '../components/Panel/DependOnSelectPanel';

import { getSourceFrame,setSourceId,getSourceWidthHeight,sourcesActions } from "../store/sources";
import { areaSelected, areaRename, areaDelete, getAppSetting,setFileWidthHeight } from "../store/areas";
import { fetchData,deleteTask } from "../store/tasks";


import { Link, useParams } from 'react-router-dom';




function AddAiTask() {


    const [sourceMenu, setSourceMenu] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [applicationOptions, setApplicationOptions] = useState([]);
    const [sourceContent, setSourceContent] = useState('');
    const [sourceId, setSourceId] = useState(null);

    const [showAppSetting, setShowAppSetting] = useState(false);

    const [mode, setMode] = useState('select');
    const [linePanel, setLinePanel] = useState(false);

    const [basicType, setBasicType] = useState(false);

    const [taskUid, setTaskUid] = useState('');
    const [modelType, setModelType] = useState('');
    const [taskName,setTaskName]= useState('');
    const [confidence,setConfidence] = useState(0.8)

    const sourceRef = useRef(null);
    const modelRef = useRef(null);
    const applicationRef = useRef(null);
    const confidenceRef = useRef(null);
    const sourcePanelRef = useRef(null);
    const areaRenameRef = useRef(null);
    const lineRelation1Ref = useRef(null);
    const lineRelation2Ref = useRef(null);

    const params = useParams();

    const navigate = useNavigate ();

    const linePanelRef = {
        line1Ref: lineRelation1Ref,
        line2Ref: lineRelation2Ref
    }


    const [colorList, setColorList] = useState([]);
    const [areaArr, setAreaArr] = useState([[0, 'Area 1']]);
    const [areaShape, setAreaShape] = useState([[{ "x": 5, "y": 5 }, { "x": 200, "y": 5 }, { "x": 200, "y": 250 }, { "x": 5, "y": 250 }]]);
    //const [areaEditingIndex, setAreaEditingIndex] = useState(0);

    const areaNameArr = useSelector((state) => state.areas.areaNameArr);
    const lineNameArr = useSelector((state) => state.areas.lineNameArr);
    const linePointArr = useSelector((state) => state.areas.linePointArr);
    const areaShapeArr = useSelector((state) => state.areas.areaShapeArr);
    const areaDependOn = useSelector((state) => state.areas.areaDependOn);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);
    const lineRelationArr = useSelector((state) => state.areas.lineRelationArr);

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedApplication, setSelectedApplication] = useState('');
    const [showAreaRenameModal, setShowAreaRenameModal] = useState(false);

    const deviceArr = useSelector((state) => state.devices.options);
    const fileName = useSelector((state) => state.sources.fileName);
    const fileUid = useSelector((state) => state.sources.uid);
    const fileUrl = useSelector((state) => state.sources.fileUrl);
    const sourceUid = useSelector((state) => state.sources.uid);
    const drawWidth = useSelector((state) => state.sources.drawWidth);
    const drawHeight = useSelector((state) => state.sources.drawHeight);
    const fileWidth = useSelector((state) => state.sources.width);
    const fileHeight = useSelector((state) => state.sources.height);
    const modelUid = useSelector((state) => state.models.uid);

    const taskData = useSelector((state) => state.tasks.data);
    const taskStatus = useSelector((state) => state.tasks.status);
    const sourcesStatus = useSelector((state) => state.sources.status);

    const taskNameRef = useRef(null);

    const [modifyAreaName, setModifyAreaName] = useState('');
    const [modifyAreaIndex, setModifyAreaIndex] = useState(-1);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllDevices());
        dispatch(getAllModels());
        dispatch(getAllApplications());

    }, []);

    useEffect(() => {

        if (deviceArr.length > 0) setSelectedDevice(deviceArr[0][0])

    }, [deviceArr]);

    const fileMaxWidth = 860;
    const fileMaxHeight = 558;

    useEffect(() => {
        setSourceContent(fileName);
        if (fileName !== '') {
            // upload success, set menu close
            sourceRef.current.setButtonClick();
            setShowConfirm(true);
            setTimeout(() => {
                setShowConfirm(false);
            }, 1500);
        }
    }, [fileName]);

    useEffect(() => {
        log(`--- get source frame = ${fileUid} ---`)
       
        if ((fileUid !== '')&&(fileWidth!==0)&&(fileWidth!==0)&&(selectedApplication!='')){
            dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": basicType }));
        }
    }, [fileUid,fileWidth,fileHeight,basicType,selectedApplication]);


    useEffect(() => {
        //setSourceMenu(false);
        if (fileName !== '')
            sourceRef.current.setButtonClick();
    }, []);

    const modelArr = useSelector((state) => state.models.options);
    const modelData = useSelector((state) => state.models.data);
    const applicationData = useSelector((state) => state.applications.data);

    const handleClickAdd = () => {
        log('Add Button clicked!');
    };

    const handleSourceMenuToggle = (event) => {
        log('set source menu')
        log(event)
        setSourceMenu(event);
    };

    const handleModelChange = (event, value) => {

        if (value) {
            log(value)
            setSelectedModel(value);

            const myIndex_1 = modelData.findIndex(item => item.uid === value);
            const myType = modelData[myIndex_1].type;
            const myDependOn = modelData[myIndex_1].classes;

            const myAppArr = search(applicationData, myType);
            let myAppOptions = [];
            myAppArr.forEach(item => {
                myAppOptions.push([item, item.replace(/_/g, " ")])
            });
            setApplicationOptions(myAppOptions);
            setShowAppSetting(false);
            dispatch(setDependOn(JSON.parse(myDependOn.replace(/'/g, '"'))))


        }

        //const myIndex_2 = applicationData.findIndex(item => item.uid === value);
    };

    const handleApplicationChange = (event, value) => {


        setSelectedApplication(value === null ? '' : value);
        log('application change');

        if (value) {
            (value.toLowerCase() === 'movement_zone') ? setLinePanel(true) : setLinePanel(false);

            if (value.toLowerCase().indexOf("basic") >= 0) {

                setBasicType(true);
                dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": true }));
            } else {
                setBasicType(false);
                dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": false }));
            }
        }

        log('line panel?')
        log(linePanel)

    };

    const handleAcceleratorsChange = (event, value) => {
        log('acc change')
        setSelectedDevice(value)
    };

    const handleAreaChange = (event, idx) => {

        dispatch(areaSelected(idx))
    };

    const handleAreaRename = (idx) => {

        const areaName = areaNameArr[idx][1];
        setModifyAreaIndex(idx);
        setModifyAreaName(areaName);
        setShowAreaRenameModal(true);

    };

    const convertToRGB = (myItem) => {

        myItem = myItem.replace('#', '');
        const aRgbHex = myItem.match(/.{1,2}/g);
        const aRgb = [

            parseInt(aRgbHex[2], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[0], 16)
        ];
        return aRgb;
    }

    const convertToScale = (myScale, myLength) => {
        return parseFloat(parseFloat((myScale / parseInt(myLength))).toFixed(3));
    }

    const handleSubmit = () => {
        log('Submit Click');
        const postData = {};
        postData.task_name = taskNameRef.current.value;
        postData.source_uid = sourceUid
        postData.model_uid = selectedModel;
        postData.model_setting = { "confidence_threshold": parseFloat(confidenceRef.current.value) }
        postData.device = selectedDevice;
        postData.app_name = selectedApplication;

        // Get App Setting
        let areas = [];
        let myPalette = [];
        areaDependOn[0].forEach(function (item, idx) {
            let myItem = {};
            myItem.name = item.name;
            myItem.checked = false;
            myItem.color = convertToRGB(item.color);
            myPalette.push(myItem);
        });
        areaNameArr.forEach(function (value, idx, array) {

            let myDependOn = [];

            areaDependOn[idx].forEach(function (item, idx) {
                if (item.checked === true) {
                    myPalette[idx].checked = true;
                    myDependOn.push(item.name);
                }
            });

            let myShape = [];
            areaShapeArr[idx].forEach(function (item, idx) {
                let shape = [];
                shape.push(convertToScale(item.x, drawWidth), convertToScale(item.y, drawHeight));
                myShape.push(shape);
            });

            let myLine = {};
            if (selectedApplication.toLowerCase() === 'movement_zone') {
                log('add line info')
                log(linePointArr[idx])
                myLine[lineNameArr[idx][0]] = [[convertToScale(linePointArr[idx][0][0], drawWidth), convertToScale(linePointArr[idx][0][1], drawHeight)], [convertToScale(linePointArr[idx][0][2], drawWidth), convertToScale(linePointArr[idx][0][3], drawHeight)]];
                myLine[lineNameArr[idx][1]] = [[convertToScale(linePointArr[idx][1][0], drawWidth), convertToScale(linePointArr[idx][1][1], drawHeight)], [convertToScale(linePointArr[idx][1][2], drawWidth), convertToScale(linePointArr[idx][1][3], drawHeight)]];
            }

            let myLineRelation = [];
            if (selectedApplication.toLowerCase() === 'movement_zone') {
                let myItem1 = {};
                myItem1.name = lineRelationArr[idx][0];
                myItem1.start = lineNameArr[idx][0];
                myItem1.end = lineNameArr[idx][1];

                let myItem2 = {};
                myItem2.name = lineRelationArr[idx][1];
                myItem2.start = lineNameArr[idx][1];
                myItem2.end = lineNameArr[idx][0];

                myLineRelation.push(myItem1);
                myLineRelation.push(myItem2);
            }


            const myItem = {};
            myItem.name = areaNameArr[idx][1];
            if (!basicType) {
                myItem.area_point = myShape;
            }
            myItem.depend_on = myDependOn;
            if (selectedApplication.toLowerCase() === 'movement_zone') {
                myItem.line_point = myLine;
                myItem.line_relation = myLineRelation;
            }

            areas.push(myItem);

        });

        let myPaletteArr = {};
        myPalette.forEach(function (item, idx) {
            let myItem = {};
            if (item.checked === true) {
                myPaletteArr[item.name] = item.color;
            }
        });

        postData.app_setting = {};
        postData.app_setting.application = {};
        postData.app_setting.application.palette = myPaletteArr;
        postData.app_setting.application.areas = areas;


        log('--- postData ---');
        log(postData);
        dispatch(addTask(postData));
        
        navigate('/');
    };

    const handleSuccess = (fileName, uid) => {
        log('--- upload file success ---')
        log(fileName)
        setSourceContent(fileName);
        setSourceId(uid);

    }

    const handleSelectMode = (event) => {
        log('handle select mode')
        setMode('select');
    }

    const handleEditMode = (event) => {
        log('handle edit mode');
        setMode('edit');
    }

    const handleAddMode = (event) => {
        log('handle add mode')
        setMode('add');
    }

    const handleLineMode = (event) => {
        log('handle line mode')
        setMode('line');
    }

    const handleDeleteMode = (event) => {
        log('handle delete area');
        //setMode('delete');
        dispatch(areaDelete());
    }

    const handleChangeMode = (myMode) => {
        log('handle change mode');
        log(myMode);
        setMode(myMode);
    }

    const handleAreaRenameComplete = (myMode) => {

        const myData = {};
        myData.name = areaRenameRef.current.value;
        myData.idx = modifyAreaIndex;
        dispatch(areaRename(myData));
        setShowAreaRenameModal(false);

    }

    const handleDelete = () => {
       
        dispatch(deleteTask(taskUid));
        navigate('/');
    };

    useEffect(() => {
        log('---fileUrl---')
        log(fileUrl)
        if ((!taskUid)&&(fileUrl==='')){
          // dispatch(initData({ "w": drawWidth, "h": drawHeight }));
        }
      

        dispatch(initData({ "w": drawWidth, "h": drawHeight }));

    }, [fileUrl]);

    useEffect(() => {

        if ((sourceUid !== '') && (selectedModel !== '') && (selectedApplication !== '')) {
            setShowAppSetting(true);
        }


    }, [sourceUid, selectedModel, selectedApplication]);

    useEffect(() => {
        if (params.uuid) {
            setTaskUid(params.uuid);
            dispatch(fetchData());
        }
    }, [params.uuid]);

    useEffect(() => {

        if ((taskStatus === 'success') && (taskUid !== '')) {

            const myIndex = taskData.findIndex(item => item.task_uid === taskUid);
            const myItem = taskData[myIndex];
            const { model_uid, model_type, task_name, model_setting, device, source_name, source_uid, app_name } = myItem;
            setSelectedModel(model_uid);
            setModelType(model_type);
            setTaskName(task_name);
            setConfidence(model_setting.confidence_threshold);
            setSelectedDevice(device);
            setSourceContent(source_name[0]);
            setSourceId(source_uid);
            //setSelectedApplication('');

            const myPayload={};
            myPayload.uid=source_uid;
            dispatch(sourcesActions.setSourceId(myPayload));
            dispatch(getSourceWidthHeight());

            (app_name[0].toLowerCase().indexOf("basic") >= 0)?setBasicType(true):setBasicType(false);
            

            log('--- myItem ---')
            log(myItem);

          
        }

    }, [taskStatus]);

    useEffect(()=>{

        log('---------- fetch app setting ---')
       
        if ((taskUid!=='')&&(drawHeight>0)&&(drawWidth>0)){
           
            dispatch(setFileWidthHeight({"drawWidth":drawWidth,"drawHeight":drawHeight}))
            dispatch(getAppSetting(taskUid));
        }

    },[taskUid,drawHeight,drawWidth])

    useEffect(() => {

        if ((taskUid !== '') && (modelType !== '') && (applicationData !== [])) {
            const myAppArr = search(applicationData, modelType);
            const myIndex = taskData.findIndex(item => item.task_uid === taskUid);
            const myItem = taskData[myIndex];
            const { app_name } = myItem;
            setSelectedApplication('');
            setSelectedApplication(app_name[0]);
            
            let myAppOptions = [];
            myAppArr.forEach(item => {
                myAppOptions.push([item, item.replace(/_/g, " ")])
            });
            setApplicationOptions(myAppOptions);
            setSelectedApplication(app_name[0]);

            (app_name[0].toLowerCase() === 'movement_zone') ? setLinePanel(true) : setLinePanel(false);
        }


    }, [taskUid, modelType, applicationData]);


    useEffect(() => {

        log('sourcesStatus')
        log(sourcesStatus)

        if ((sourcesStatus === 'success') && (taskUid !== '')) {
            const myIndex = taskData.findIndex(item => item.task_uid === taskUid);
            const myItem = taskData[myIndex];
            const { source_uid} = myItem;
            if (selectedApplication.toLowerCase().indexOf("basic") >= 0) {
                setBasicType(true);
                dispatch(getSourceFrame({ "fileUid": source_uid, "basicType": true }));
            } else {
                setBasicType(false);
                dispatch(getSourceFrame({ "fileUid": source_uid, "basicType": false }));
            }
         
        }

    }, [sourcesStatus]);


    return (
        <SimpleLayout>


            <div className="container p-0">
                <div className="my-body">
                    <div className="row p-0 g-0 mb-3 mt-3">
                    <div className="col-12 d-flex justify-content-between align-items-center my-flex-gap">

                            {
                                (taskUid==='')&&
                                <div className="my-body-title roboto-h2">
                                    Add AI task
                                </div>
                            }

                            
                            {
                                (taskUid!=='')&&
                                <div className="my-body-title roboto-h2">
                                    Edit {taskName}
                                </div>
                            }
                            

                            <div className='d-flex justify-content-start align-items-center'>
                                {
                                     (taskUid!=='')&&
                                     <CustomButton name='delete' onClick={handleDelete}></CustomButton>
                                }
                                
                            </div>
                        </div>
                    </div>

                    <div className="row py-0">
                        <div className="col-12">
                            <hr className="my-divider" />
                        </div>
                    </div>


                    <div className="row mb-2 p-2">
                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap py-2">
                            <div className="my-sub-title">
                                General
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap gap-3 py-3">
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    AI task name *
                                </div>
                                <div>
                                    <CustomInput defaultValue={taskName} width="240" height="52" ref={taskNameRef} onChange={() => { }}></CustomInput>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1 d-flex flex-row justify-content-between'>
                                    <div>
                                        Source *
                                    </div>
                                    <div>
                                        {
                                            showConfirm &&
                                            <ToolIcon_Confirm className="my-source-confirm" />
                                        }

                                    </div>

                                </div>
                                <div>

                                    <CustomSelectSource name={sourceContent} width="240" height="52" fontSize="16" ref={sourceRef} onListboxOpenChange={handleSourceMenuToggle} placeHolder={true} />

                                </div>
                                <div className='position-relative'>
                                    {
                                        sourceMenu &&

                                        <SourcePanel />

                                    }
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Model *
                                </div>
                                <div>
                                    <CustomSelect areaArr={modelArr} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleModelChange} placeHolder={true} ref={modelRef} defaultValue={selectedModel} ></CustomSelect>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Application *
                                </div>
                                <div>
                                    <CustomSelect areaArr={applicationOptions} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleApplicationChange} placeHolder={true} ref={applicationRef} defaultValue={selectedApplication}></CustomSelect>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap gap-3">
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Confidence * (0.01~0.99)
                                </div>
                                <div>
                                    <CustomInput defaultValue={confidence} width="240" height="52" ref={confidenceRef} onChange={() => { }}></CustomInput>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Accelerators *
                                </div>
                                <div>
                                    <CustomSelect areaArr={deviceArr} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleAcceleratorsChange} placeHolder={true} defaultValue={selectedDevice}></CustomSelect>
                                </div>
                            </div>

                        </div>
                    </div>



                    <div className="row py-3 mt-3">
                        <div className="col-12">
                            <hr className="my-divider" />
                        </div>
                    </div>


                    <div className="row p-2">
                        <div className="col-12 d-flex justify-content-start align-items-center">
                            <div className="my-sub-title">
                                Application
                            </div>
                        </div>
                    </div>

                    {
                        showAppSetting &&

                        <div className="row p-2 g-0 my-3 mb-4">
                            <div className="col-12 d-flex justify-content-between my-area-container bdr">

                                <table className='w-100' style={{ border: '1px' }}>
                                    <tbody>
                                        <tr>
                                            {
                                                (!basicType) &&

                                                <td className='my-area-p3-a'>
                                                    <div className='w-100 h-100 d-flex flex-column p-0 align-items-center'>
                                                        <div className="position-relative">
                                                            <ToolIcon_Point className={mode === 'select' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleSelectMode} />
                                                        </div>

                                                        <ToolIcon_Pen className={mode === 'edit' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleEditMode} />

                                                        <ToolIcon_Pen_Add className={mode === 'add' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleAddMode} />

                                                        {
                                                            linePanel &&
                                                            <ToolIcon_Line className={mode === 'line' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleLineMode} />
                                                        }

                                                        <ToolIcon_Delete className={mode === 'delete' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleDeleteMode} />
                                                    </div>
                                                </td>
                                            }
                                            <td className='my-area-p3-b' style={{ background: (basicType) ? 'black' : 'white' }}>
                                                <div className='w-100 d-flex flex-column align-items-center'>
                                                    {
                                                        (fileUrl === '') &&
                                                        <Image_Default style={{ width: (basicType) ? 856 : 806, height: 560, background: 'white', border: '0px solid white' }} />
                                                    }

                                                    {
                                                        ((fileUrl !== '') && (!basicType)) &&
                                                        <CustomDrawing
                                                            src={fileUrl}
                                                            width={(basicType) ? (drawWidth + 50) : drawWidth}
                                                            height={drawHeight}
                                                            mode={mode}
                                                            setMode={handleChangeMode}
                                                            areaArr={areaArr}
                                                            showAppSetting={showAppSetting}
                                                            linePanel={linePanel}

                                                        >
                                                        </CustomDrawing>
                                                    }

                                                    {
                                                        ((fileUrl !== '') && (basicType)) &&

                                                        // 
                                                        <img src={fileUrl}></img>
                                                    }
                                                </div>
                                            </td>
                                            <td className='my-area-p3-c'>
                                                <div className='w-100 h-100 d-flex flex-column p-0 align-items-start'>
                                                    <div className='my-area-p3-c1' style={{ height: (basicType) ? 62 : 80 }}>
                                                        {
                                                            (!basicType) &&
                                                            <CustomSelectArea areaArr={areaNameArr} width="280" height="48" fontSize="20" className="my-dropdown-select" onChange={handleAreaChange} defaultValue={areaEditingIndex} areaRename={handleAreaRename}></CustomSelectArea>
                                                        }
                                                        {
                                                            (basicType) &&
                                                            <div className='roboto-h4'>Full Screen</div>
                                                        }
                                                    </div>
                                                    <div className='my-area-p3-c2'>
                                                        <DependOnSelectPanel linePanel={linePanel} basicType={basicType} />
                                                        {/* <DependOnSelectPanel dependOn={[]} linePanel={linePanel}/> */}
                                                    </div>

                                                    {
                                                        linePanel &&
                                                        <LinePanel ref={linePanelRef} />
                                                    }

                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    }

                    {
                        (!showAppSetting) &&
                        <div className='roboto-b1' style={{ color: 'var(--on_color_2)', padding: '0px 8px' }}>
                            Please complete general section first.
                        </div>
                    }



                    <div className="row py-3 mt-4">
                        <div className="col-12">
                            <hr className="my-divider" />
                        </div>
                    </div>

                    <div className="row p-0 g-0 mb-3">
                        <div className="col-12 d-flex justify-content-end align-items-center my-flex-gap gap-3">
                            <Link to="/">
                                <CustomButton name='cancel'></CustomButton>
                            </Link>

                            <CustomButton name='submit' onClick={handleSubmit} disabled={!showAppSetting}></CustomButton>
                        </div>
                    </div>


                </div>
            </div>


            <Modal
                open={showAreaRenameModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 400 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0' style={{ paddingTop: 20, paddingLeft: 20 }}>
                                <div style={{ paddingTop: 20, paddingLeft: 20 }}>
                                    Rename
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-b1 p-0' style={{ color: 'var(--on_color_2)' }}>
                                <div style={{ paddingTop: 25, paddingLeft: 20 }}>
                                    Area name
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0'>
                                <div style={{ paddingTop: 5, paddingLeft: 20, paddingRight: 20 }}>
                                    <CustomInput width="420" height="52" defaultValue={modifyAreaName} ref={areaRenameRef} onChange={() => { }} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end '>
                                <div style={{ paddingTop: 140, paddingRight: 8 }} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowAreaRenameModal(false);
                                    }} />
                                    <CustomButton name="save" onClick={handleAreaRenameComplete} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>






        </SimpleLayout>
    );
}

export default AddAiTask;
