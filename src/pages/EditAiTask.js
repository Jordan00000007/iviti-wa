import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import CustomAlert from '../components/Alerts/CustomAlert';
import DrawingTooltip from '../components/Tooltips/DrawingTooltip';

import CustomInput from '../components/Inputs/CustomInput';
import LinePanel from '../components/Panel/LinePanel';
import CustomDrawing from '../components/Drawing/CustomDrawing';

import { useSelector, useDispatch } from "react-redux";

import { getAllDevices } from "../store/devices";
import { getAllModels, importModel, deleteModel } from "../store/models";
import { getAllApplications } from "../store/applications";
import { addTask, updateTask } from "../store/tasks";
import areas, { initData, setDependOn, setLinePanel } from "../store/areas";


import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Tooltip from '@mui/joy/Tooltip';

import { Image } from "react-konva";
import useImage from "use-image";
import Hotkeys from "react-hot-keys";


import log from "../utils/console";
import search from "../utils/search";

import CustomSelect from '../components/Dropdowns/CustomSelect';
import CustomSelectArea from '../components/Dropdowns/CustomSelectArea';
import CustomSelectModel from '../components/Dropdowns/CustomSelectModel';
import CustomSelectSource from '../components/Dropdowns/CustomSelectSource';
import CustomLoading from '../components/Loading/CustomLoading';


import { ReactComponent as ToolIcon_Point } from '../assets/Icon_Point.svg';
import { ReactComponent as ToolIcon_Pen } from '../assets/Icon_Pen.svg';
import { ReactComponent as ToolIcon_Pen_Add } from '../assets/Icon_Pen_Add.svg';
import { ReactComponent as ToolIcon_Line } from '../assets/Icon_Line.svg';
import { ReactComponent as ToolIcon_Delete } from '../assets/Icon_Delete.svg';
import { ReactComponent as ToolIcon_Confirm } from '../assets/Icon_Confrim.svg';
import { ReactComponent as Image_Default } from '../assets/Image_Default.svg';

import SourcePanel from '../components/Panel/SourcePanel';
import DependOnSelectPanel from '../components/Panel/DependOnSelectPanel';

import { getSourceFrame, getSourceInfo, setSourceId, getSourceWidthHeight, sourcesActions, resetFrameStatus, setDrawWidthHeight } from "../store/sources";
import { areaSelected, areaRename, areaDelete, getAppSetting, setFileWidthHeight, areasActions, lineDataReset, setModelData, resetStatus, setSelectedApplication, setSelectedModel, lineADelete, resetDeleteStatus } from "../store/areas";
import { fetchData, deleteTask, resetError, setTaskDeleteMessage } from "../store/tasks";


import { Link, useParams } from 'react-router-dom';




function EditAiTask() {


    const [sourceMenu, setSourceMenu] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [applicationOptions, setApplicationOptions] = useState([]);
    const [sourceContent, setSourceContent] = useState('');
    const [sourceId, setSourceId] = useState(null);
    const [sourceType, setSourceType] = useState('');

    const [showAppSetting, setShowAppSetting] = useState(false);

    const [mode, setMode] = useState('select');
    const [linePanel, setLinePanel] = useState(false);

    const [basicType, setBasicType] = useState(false);

    const [taskUid, setTaskUid] = useState('');
    const [modelType, setModelType] = useState('');
    const [taskName, setTaskName] = useState('');
    const [confidence, setConfidence] = useState(0.9);

    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');

    const [fromPage, setFromPage] = useState(0);

    const alertRef = useRef();

    const sourceRef = useRef(null);
    const modelRef = useRef(null);
    const deviceRef = useRef(null);
    const applicationRef = useRef(null);
    const confidenceRef = useRef(null);
    const sourcePanelRef = useRef(null);
    const areaRenameRef = useRef(null);
    const lineRelation1Ref = useRef(null);
    const lineRelation2Ref = useRef(null);
    const lineRelationTitleRef = useRef(null);
    const taskTitleRef = useRef(null);
    const confidenceTitleRef = useRef(null);
    const dependOnTitle = useRef(null);
    const customDrawingRef = useRef(null);

    const KeySRef = useRef(null);
    const KeyERef = useRef(null);
    const KeyARef = useRef(null);
    const KeyLRef = useRef(null);
    const KeyDRef = useRef(null);
    const fileRef = useRef(null);


    const params = useParams();

    const navigate = useNavigate();



    const linePanelRef = {
        line1Ref: lineRelation1Ref,
        line2Ref: lineRelation2Ref,
        lineTitleRef: lineRelationTitleRef
    }

    const setMessageOpen = (showType, showText) => {
        setShowType(showType);
        setShowText(showText);
        alertRef.current.setShowTrue(3000);

    };

    const setMessageKeep = (showType, showText) => {
        setShowType(showType);
        setShowText(showText);
        alertRef.current.setShowKeep();

    };

    const setMessageClose = () => {

        alertRef.current.setShowClose();

    };


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
    const selectedApplicationSlice = useSelector((state) => state.areas.selectedApplication);
    const lineRelationArr = useSelector((state) => state.areas.lineRelationArr);
    const areaStatus = useSelector((state) => state.areas.status);

    const areaDeleteStatus = useSelector((state) => state.areas.deleteStatus);
    const areaDeleteMessage = useSelector((state) => state.areas.deleteMessage);




    const modelStatus = useSelector((state) => state.models.status);
    const deviceStatus = useSelector((state) => state.devices.status);
    const applicationStatus = useSelector((state) => state.applications.status);

    const [selectedModel, setSelectedModel] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedApplication, setSelectedApplication] = useState('');
    const [showAreaRenameModal, setShowAreaRenameModal] = useState(false);
    const [showModelDeleteModal, setShowModelDeleteModal] = useState(false);

    const [showTaskDeleteModal, setShowTaskDeleteModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    const [deleteModelUid, setDeleteModelUid] = useState(null);
    const [deleteModelName, setDeleteModelName] = useState('');

    const [lineReady, setLineReady] = useState(false);


    const deviceArr = useSelector((state) => state.devices.options);
    const fileName = useSelector((state) => state.sources.fileName);
    const fileUid = useSelector((state) => state.sources.uid);
    const fileUrl = useSelector((state) => state.sources.fileUrl);
    const sourceUid = useSelector((state) => state.sources.uid);
    const drawWidth = useSelector((state) => state.sources.drawWidth);
    const drawHeight = useSelector((state) => state.sources.drawHeight);
    const originWidth = useSelector((state) => state.sources.originWidth);
    const originHeight = useSelector((state) => state.sources.originHeight);
    const modelUid = useSelector((state) => state.models.uid);

    const modelImportStatus = useSelector((state) => state.models.importStatus);
    const modelImportMessage = useSelector((state) => state.models.importMessage);

    const modelDeleteStatus = useSelector((state) => state.models.deleteStatus);
    const modelDeleteMessage = useSelector((state) => state.models.deleteMessage);

    const taskData = useSelector((state) => state.tasks.data);
    const taskStatus = useSelector((state) => state.tasks.status);
    const taskError = useSelector((state) => state.tasks.error);

    const taskDeleteMessage = useSelector((state) => state.tasks.deleteMessage);
    const taskDeleteStatus = useSelector((state) => state.tasks.deleteStatus);

    const taskAddMessage = useSelector((state) => state.tasks.addMessage);
    const taskAddStatus = useSelector((state) => state.tasks.addStatus);

    const taskUpdateMessage = useSelector((state) => state.tasks.updateMessage);
    const taskUpdateStatus = useSelector((state) => state.tasks.updateStatus);


    const uploadStatus = useSelector((state) => state.sources.uploadStatus);
    const frameStatus = useSelector((state) => state.sources.frameStatus);
    const sizeStatus = useSelector((state) => state.sources.sizeStatus);
    const taskSourceType = useSelector((state) => state.sources.type);

    const infoMessage = useSelector((state) => state.sources.infoMessage);
    const infoStatus = useSelector((state) => state.sources.infoStatus);

    const taskNameRef = useRef(null);

    const [modifyAreaName, setModifyAreaName] = useState('');
    const [modifyAreaIndex, setModifyAreaIndex] = useState(-1);

    const dispatch = useDispatch();



    const fileMaxWidth = 854;
    const fileMaxHeight = 558;

    const handleImportModel = (event, value) => {
        fileRef.current.click();
    };

    const handleModelDelete = (value) => {

        setDeleteModelUid(value.uid);
        setDeleteModelName(value.name);
        setShowModelDeleteModal(true);
    };

    const handleModelDeleteExecute = () => {

        setShowModelDeleteModal(false);
        dispatch(deleteModel(deleteModelUid));
    };

    useEffect(() => {
        setSourceContent(fileName);
        if ((uploadStatus==='success')&&(fileName !== '')) {
            // upload success, set menu close
            sourceRef.current.setButtonClick();
            setShowConfirm(true);
            setTimeout(() => {
                setShowConfirm(false);
            }, 1500);
        }
    }, [fileName,uploadStatus]);

    useEffect(() => {

        if (modelImportStatus === 'success') {
            setMessageClose();
            setMessageOpen(0, modelImportMessage);
            fileRef.current.value = "";

            setTimeout(() => {
                dispatch(getAllModels());

            }, 3000);
        }
        if (modelImportStatus === 'error') {
            setMessageClose();
            setMessageOpen(1, modelImportMessage);
            fileRef.current.value = "";
        }
        if (modelImportStatus === 'loading') {
            setMessageKeep(2, 'Import model loading...');
        }


    }, [modelImportStatus]);

    useEffect(() => {

        if (modelDeleteStatus === 'success') {
            setMessageClose();
            setMessageOpen(0, modelDeleteMessage);

            setTimeout(() => {
                dispatch(getAllModels());
                setApplicationOptions([]);
            }, 1000);
        }
        if (modelDeleteStatus === 'error') {
            setMessageClose();
            setMessageOpen(1, modelDeleteMessage);

        }
        if (modelDeleteStatus === 'loading') {
            setMessageKeep(2, 'Delete model loading...');
        }


    }, [modelDeleteStatus]);


    useEffect(() => {

        if (fileName !== '')
            sourceRef.current.setButtonClick();
    }, []);

    const modelArr = useSelector((state) => state.models.options);
    const modelData = useSelector((state) => state.models.data);
    const applicationData = useSelector((state) => state.applications.data);

    const handleSourceMenuToggle = (event) => {

        setSourceMenu(event);
    };

    const handleModelChange = (event, value) => {

        log('--- handle model change ---')
        log(value)

        if (value) {

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
            log('---(2) handle model change')
            dispatch(setDependOn(JSON.parse(myDependOn.replace(/'/g, '"'))))
            setShowAppSetting(false);


        }


    };

    const handleApplicationChange = (event, value) => {

        log('--- handle application change ---')
        if ((value !== -1) && (value !== "")) {



            log(value)
            if (value !== null) {
                setSelectedApplication(value)
            }



            if (value) {

                setShowAppSetting(false)

                if (value.toLowerCase() === 'movement_zone') {
                    setLinePanel(true);
                    const myLinePanel = {};
                    myLinePanel.linePanel = true;
                    dispatch(areasActions.setLinePanel(myLinePanel))

                } else {
                    setLinePanel(false);
                    const myLinePanel = {};
                    myLinePanel.linePanel = false;
                    dispatch(areasActions.setLinePanel(myLinePanel))
                    dispatch(areasActions.lineDataReset());

                }

                if (value.toLowerCase().indexOf("basic") >= 0) {
                    setBasicType(true);
                    dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": true }));
                } else {
                    setBasicType(false);

                    //------------
                    const fileMaxWidth = 800;
                    const fileMaxHeight = 558;
                    const myWidth = parseInt(originWidth);
                    const myHeight = parseInt(originHeight);
                    let fileSetWidth = Math.trunc((myWidth / myHeight) * fileMaxHeight);
                    let fileSetHeight = Math.trunc((myHeight / myWidth) * fileMaxWidth);
                    if (fileSetWidth <= fileMaxWidth) {
                        fileSetHeight = fileMaxHeight;
                    } else {
                        if (fileSetHeight <= fileMaxHeight) {
                            fileSetWidth = fileMaxWidth;
                        }
                    }


                    dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": false }));



                    dispatch(initData({ "w": fileSetWidth, "h": fileSetHeight }));
                }
            }
        }

    };

    const handleAcceleratorsChange = (event, value) => {

        if (value !== null) {
            //setSelectedDevice(value)
        }
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

    const between = (x, min, max) => {
        return x >= min && x <= max;
    }

    const submitCheck = () => {
        let myPass = true;
        // (1) check task name
        log('(1) check task name')
        const myTaskName = taskNameRef.current.value.trim();
        if (myTaskName === '') {
            myPass = false;
            taskNameRef.current.className = "form-control roboto-b1 my-text-input-warnning";
            taskTitleRef.current.className = "my-input-title-warnning roboto-b2 py-1";
        } else {
            taskNameRef.current.className = "form-control roboto-b1 my-text-input";
            taskTitleRef.current.className = "my-input-title roboto-b2 py-1";
        }
        log(myPass)

        // (2) check confidence
        log('(2) check confidence')
        const myConfidence = confidenceRef.current.value;
        if (!between(myConfidence, 0.01, 0.99)) {
            myPass = false;
            confidenceRef.current.className = "form-control roboto-b1 my-text-input-warnning";
            confidenceTitleRef.current.className = "my-input-title-warnning roboto-b2 py-1"
        } else {
            confidenceRef.current.className = "form-control roboto-b1 my-text-input";
            confidenceTitleRef.current.className = "my-input-title roboto-b2 py-1"
        }
        log(myPass)

        // (3) check depend on
        log('(3) check depend on')
        log('---- areaDependOn ----')
        log(areaDependOn)
        let dependOnCountArr = [];
        areaDependOn.forEach(function (item, idx) {
            let myCount = 0;
            item.forEach(function (item2, idx2) {
                if (item2.checked === true) myCount++;
            });
            dependOnCountArr.push(myCount);
        });
        const foundIndex1 = dependOnCountArr.findIndex(element => element <= 0);
        log('foundIndex1=' + foundIndex1)
        log('dependOnCountArr.length=' + dependOnCountArr.length)
        dependOnTitle.current.className = "roboto-h5";
        if (foundIndex1 >= 0) {
            myPass = false;
            dispatch(areaSelected(foundIndex1));
            dependOnTitle.current.className = "roboto-h5 my-warnning";
        }
        log(myPass)

        // (4) check line drawing
        log('(4) check line drawing')
        if (linePanel) {
            let foundIndex3 = -1;
            linePointArr.forEach(function (item, idx) {
                if (item[0].length === 0) foundIndex3 = idx;
                if (item[1].length === 0) foundIndex3 = idx;
            });
            if (foundIndex3 >= 0) {
                myPass = false;
                dispatch(areaSelected(foundIndex3));
                //return myPass;

            }

        }
        log(myPass)

        // (5) check line relation
        log('(5) check line relation')
        if (linePanel) {

           
            if (lineRelationTitleRef.current.getReady()) {

                lineRelation1Ref.current.className = "form-control roboto-b1 my-text-input";
                lineRelation2Ref.current.className = "form-control roboto-b1 my-text-input";
                lineRelationTitleRef.current.setRedTitleTextFalse();

                let foundIndex2 = -1;
                lineRelationArr.forEach(function (item, idx) {
                    log('---------item')
                    log(item)

                    if (item[0].trim() === '') {
                        foundIndex2 = idx;
                    }
                    if (item[1].trim() === '') {
                        foundIndex2 = idx;
                    }
                });
                if (foundIndex2 >= 0) {
                    myPass = false;
                    dispatch(areaSelected(foundIndex2))


                    let myFlag = false;
                    if (lineRelation1Ref.current.value.trim() === '') {
                        lineRelation1Ref.current.className = "form-control roboto-b1 my-text-input-warnning";
                        myFlag = true;
                    }

                    if (lineRelation2Ref.current.value.trim() === '') {
                        lineRelation2Ref.current.className = "form-control roboto-b1 my-text-input-warnning";
                        myFlag = true;
                    }
                    if (myFlag) {
                        
                        lineRelationTitleRef.current.setRedTitleTextTrue();
                    }
                }
            }else{
                log('no ready')
                setLineReady(false);
                lineRelationTitleRef.current.setRedText();
            }

        }
        log(myPass)

        if (!myPass) {
            setMessageOpen(1, "Please fix the errors marked with red.");
        }

        //return false;
        return myPass;

    }

    const handleCancelClick = () => {
     
        if (fromPage==="1"){
            window.location.href = `/inference/${taskUid}`;
        }else{
            window.location.href = "/";
        }
        
    }

    const handleSubmit = () => {
        log('Submit Click');

        if (submitCheck() === true) {

            const postData = {};
            postData.task_name = taskNameRef.current.value;
            postData.source_uid = sourceUid
            postData.model_uid = selectedModel;
            postData.model_setting = { "confidence_threshold": parseFloat(confidenceRef.current.value) }
            postData.device = deviceRef.current.getSelectedValue();
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
                if (!basicType) {
                    areaShapeArr[idx].forEach(function (item, idx) {
                        let shape = [];
                        shape.push(convertToScale(item.x, drawWidth), convertToScale(item.y, drawHeight));
                        myShape.push(shape);
                    });
                }

                log('----------------------selectedApplication')
                log(selectedApplication)

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

            if (taskUid !== '') {
                log('--- add task  ---');
                log(postData);
                postData.task_uid = taskUid;
                dispatch(updateTask(postData));

            } else {
                log('--- update task ---');
                log(postData);
                dispatch(addTask(postData));
            }

        } else {
            log('check not pass')
        }

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


        if (mode === 'select') {
            
            customDrawingRef.current.handleDeleteObject();

        } 
    }

    const handleChangeMode = (myMode) => {

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
        //window.location.href = "/";
    };

    const handleShowDeleteModal = () => {

        setShowTaskDeleteModal(true);

    };

    const handleDrawLineComplete = () => {

        setMode('select');

    };

    const handleKeyDown = (keyName, e, handle) => {

        e.preventDefault();

        if (e.code === 'KeyS') {

            setMode('select');
        }
        if (e.code === 'KeyE') {

            setMode('edit');
        }
        if (e.code === 'KeyA') {

            setMode('add');
        }
        if (e.code === 'KeyL') {

            setMode('line');
        }
        if (e.code === 'KeyD') {

            dispatch(areaDelete());
        }

    };

    const handleFileChange = (event, value) => {

        log('handle file change')

        if (event.target.files) {

            // dispatch(resetFileName());

            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            dispatch(importModel(formData))

            // setShowType(2);
            // setShowText('Loading...');
            // setShowInterval(10000);
            // alertRef.current.setShowTrue();

        }

    };

    const handleBodyClick= (event, value) => {

        if (sourceMenu){
            sourceRef.current.setButtonClick();
        };
    
    };

    const handleSourcePanelClose=()=>{
        sourceRef.current.setButtonClick();
        setShowAppSetting(false);
    }   

    useEffect(() => {

        if (taskDeleteStatus === 'success') {
            setShowTaskDeleteModal(false);
            setMessageClose();
            dispatch(setTaskDeleteMessage(`${taskName} had been deleted.`));
            dispatch(resetError());
            navigate('/');

        }
        if (taskDeleteStatus === 'error') {
            setShowTaskDeleteModal(false);
            setMessageClose();
            setMessageOpen(1, taskDeleteMessage);

        }
        if (taskDeleteStatus === 'pending') {
            setMessageKeep(2, 'Delete task loading...');
        }


    }, [taskDeleteStatus]);


    useEffect(() => {

        if (taskAddStatus === 'success') {
            setShowTaskDeleteModal(false);
            setMessageClose();
            navigate('/');

        }
        if (taskAddStatus === 'error') {
            setShowTaskDeleteModal(false);
            setMessageClose();
            setMessageOpen(1, taskAddMessage);

        }
        if (taskAddStatus === 'pending') {
            setMessageKeep(2, 'Add task loading...');
        }


    }, [taskAddStatus]);

    useEffect(() => {

        if (taskUpdateStatus === 'success') {
            setMessageClose();
            if (fromPage==="1"){
                navigate(`/inference/${taskUid}`);
            }else{
                navigate('/');
            }

        }
        if (taskUpdateStatus === 'error') {
            setShowTaskDeleteModal(false);
            setMessageClose();
            setMessageOpen(1, taskUpdateMessage);

        }
        if (taskUpdateStatus === 'pending') {
            setMessageKeep(2, 'Update task loading...');
        }


    }, [taskUpdateStatus]);




    useEffect(() => {

        if ((taskUid !== '') && (modelType !== '') && (applicationData !== [])) {
            const myAppArr = search(applicationData, modelType);
            const myIndex = taskData.findIndex(item => item.task_uid === taskUid);
            const myItem = taskData[myIndex];
            const { app_name } = myItem;
            //setSelectedApplication('');
            //setSelectedApplication(app_name[0]);

            let myAppOptions = [];
            myAppArr.forEach(item => {
                myAppOptions.push([item, item.replace(/_/g, " ")])
            });
            setApplicationOptions(myAppOptions);
            log('---(3) set application selected data')
            log(app_name[0])
            setSelectedApplication(app_name[0]);

            (app_name[0].toLowerCase() === 'movement_zone') ? setLinePanel(true) : setLinePanel(false);
        }


    }, [taskUid, modelType, applicationData]);






    useEffect(() => {

        if (modelType !== '') {

            const myIndex_1 = modelData.findIndex(item => item.type === modelType);
            const myDependOn = modelData[myIndex_1].classes;

            if (taskUid === '') {
                dispatch(setDependOn(JSON.parse(myDependOn.replace(/'/g, '"'))))
            }

        }

    }, [modelType]);

    useEffect(() => {

        if ((deviceStatus === 'success') && (selectedDevice === '')) {
            setSelectedDevice(deviceArr[0][0]);
            deviceRef.current.setSelectedValue(deviceArr[0][0]);
        }

    }, [deviceStatus]);


    useEffect(() => {

        log('delete ----')
        log(areaDeleteStatus)
        log(areaDeleteMessage)

        if (areaDeleteMessage !== '') {
            setMessageOpen((areaDeleteStatus === 'success') ? 0 : 1, areaDeleteMessage);
            dispatch(resetDeleteStatus());
        }

    }, [areaDeleteStatus]);


    // [01] get all options data
    useEffect(() => {

        log('from page')
        log(params.from)

        setShowLoadingModal(true);
        if (params.uuid) {
            setTaskUid(params.uuid);
        }
        if (params.from) {
            setFromPage(params.from);
        }
        dispatch(getAllDevices());
        dispatch(getAllModels());
        dispatch(getAllApplications());
    }, []);

    // [02] handle all options data and fetch task data
    useEffect(() => {

        if ((modelStatus === 'success') && (applicationStatus === 'success') && (deviceStatus === 'success')) {

            if (params.uuid !== undefined) {
                dispatch(fetchData());
            }else {
                setShowLoadingModal(false);
               
            }
        }

    }, [modelStatus, applicationStatus, deviceStatus]);

    // [03] handle tasks data and fetch source width height
    useEffect(() => {

        if ((taskStatus === 'success') && (taskUid !== '')) {

            const myIndex = taskData.findIndex(item => item.task_uid === taskUid);
            const myItem = taskData[myIndex];

            const { model_uid, model_type, task_name, model_setting, device, source_name, source_uid, app_name } = myItem;

            log('--- (0) my item ---')
            log(myItem);

            log('--- (1) set task name ---')
            log(task_name)
            setTaskName(task_name);

            log('--- (2) set confidence ---')
            log(model_setting.confidence_threshold)
            setConfidence(model_setting.confidence_threshold);

            log('--- (3) set source name ---')
            log(source_name[0])
            setSourceContent(source_name[0]);

            log('--- (4) set source id ---')
            log(source_uid)
            setSourceId(source_uid);

            log('--- (5) set device ---')
            log(device)
            setSelectedDevice(device);
            deviceRef.current.setSelectedValue(device);

            log('--- (6) set model ---')
            log(model_uid)
            setSelectedModel(model_uid);
            modelRef.current.setSelectedValue(model_uid);

            log('--- (7) set application ---')
            log(app_name[0])
            setSelectedApplication(app_name[0]);
            applicationRef.current.setSelectedValue(app_name[0]);

            log('--- (8) set model type ---')
            log(model_type)
            setModelType(model_type);

            dispatch(sourcesActions.setSourceId(source_uid));
            dispatch(getSourceWidthHeight());

            (app_name[0].toLowerCase().indexOf("basic") >= 0) ? setBasicType(true) : setBasicType(false);

            if (app_name[0].toLowerCase() === 'movement_zone') {
                const myLinePanel = {};
                myLinePanel.linePanel = true;
                dispatch(areasActions.setLinePanel(myLinePanel));
            } else {
                const myLinePanel = {};
                myLinePanel.linePanel = false;
                dispatch(areasActions.setLinePanel(myLinePanel));
            }

        }

        if (taskStatus === 'update_edit_task_success') {
            dispatch(resetError());
            navigate('/');
        }

        if (taskStatus === 'update_edit_task_error') {
            log('update edit task error');
            log(taskError);
            setMessageOpen(1, taskError);
            dispatch(resetError());
        }



        if (taskStatus === 'add_new_task_error') {
            log('add new task error');
            log(taskError);
            setMessageOpen(1, taskError);
            dispatch(resetError());

        }

        
        

    }, [taskStatus]);

    // [04] handle source width height and fetch picture
    useEffect(() => {
        // log('--------------- get source frame ------------------')
        // log('sizeStatus=' + sizeStatus)
        log('originWidth=' + originWidth)
        log('originHeight=' + originHeight)

        //------------
        const fileMaxWidth = 800;
        const fileMaxHeight = 558;
        const myWidth = parseInt(originWidth);
        const myHeight = parseInt(originHeight);
        let fileSetWidth = Math.trunc((myWidth / myHeight) * fileMaxHeight);
        let fileSetHeight = Math.trunc((myHeight / myWidth) * fileMaxWidth);
        if (fileSetWidth <= fileMaxWidth) {
            fileSetHeight = fileMaxHeight;
        } else {
            if (fileSetHeight <= fileMaxHeight) {
                fileSetWidth = fileMaxWidth;
            }
        }
        log('drawWidth=' + drawWidth)
        log('drawHeight=' + drawHeight)
        log('fileSetWidth=' + fileSetWidth)
        log('fileSetHeight=' + fileSetHeight)
        // log('sourceId=' + sourceId)
        // log('basicType=' + basicType)

        if ((sizeStatus === 'success') && (originWidth > 0) && (originHeight > 0) && (fileUid !== '')) {
            log('(a) fileUid------------')
            log(fileUid)

            log('--- source type ---')
            log(taskSourceType)
            setSourceType(taskSourceType)


            dispatch(setDrawWidthHeight({ "maxWidth": 800, "maxHeight": 558 }));
            dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": basicType }));
            dispatch(initData({ "w": fileSetWidth, "h": fileSetHeight }));
        }

    }, [sizeStatus, originWidth, originHeight, fileUid]);

    // [05] handle source frame and fetch app setting
    useEffect(() => {

       
        if ((frameStatus === 'success') && (taskUid !== '') && (areaStatus === 'idle')) {
           

            dispatch(setFileWidthHeight({ "drawWidth": drawWidth, "drawHeight": drawHeight }))
            dispatch(setModelData(modelData));

            log('--selected model---')
            log(selectedModel)
            dispatch(areasActions.setSelectedModel({ "selectedModel": selectedModel }));
            dispatch(getAppSetting(taskUid));
            dispatch(resetFrameStatus());

            setShowAppSetting(true)

        }

        if ((frameStatus === 'success') && (areaStatus === 'complete')) {
            setShowAppSetting(true)
        }

        if ((frameStatus === 'error')) {
            setShowAppSetting(false);
            setShowLoadingModal(false);
            setMessageOpen(1, 'Fetch source frame error.');
        }


    }, [frameStatus]);

    // [06] handle appsetting complete
    useEffect(() => {

        if (areaStatus === 'complete') {
            if (taskUid !== '') {

                log('areaStatus=' + areaStatus);
                setShowAppSetting(true);
                setShowLoadingModal(false);
                // dispatch(resetStatus());
            }
        }

    }, [areaStatus]);




    useEffect(() => {

        if ((sourceUid !== '') && (selectedModel !== '') && (selectedApplication !== '') && (taskUid === '')) {
            log('---(1) add task --- set show app setting true')
            log('sourceUid='+sourceUid)
            log('selectedModel='+selectedModel)
            log('selectedApplication='+selectedApplication)
            log('taskUid='+taskUid)

            // check app options
            let myFlag=true;
            applicationOptions.forEach(item => {
                if(item[0]===selectedApplication){
                    myFlag=false;
                }
            });
            if (myFlag) {
                setSelectedApplication(null);
                setShowAppSetting(false);
            }else{
                setShowAppSetting(true);
            }


            //------------
            const fileMaxWidth = 800;
            const fileMaxHeight = 558;
            const myWidth = parseInt(originWidth);
            const myHeight = parseInt(originHeight);
            let fileSetWidth = Math.trunc((myWidth / myHeight) * fileMaxHeight);
            let fileSetHeight = Math.trunc((myHeight / myWidth) * fileMaxWidth);
            if (fileSetWidth <= fileMaxWidth) {
                fileSetHeight = fileMaxHeight;
            } else {
                if (fileSetHeight <= fileMaxHeight) {
                    fileSetWidth = fileMaxWidth;
                }
            }
            //------------

            dispatch(initData({ "w": fileSetWidth, "h": fileSetHeight }));
            dispatch(getSourceFrame({ "fileUid": fileUid, "basicType": basicType }));
           
        }


    }, [sourceUid, selectedModel, selectedApplication]);


   


    return (
        <SimpleLayout>
            <Hotkeys
                keyName="s,e,a,l,d"
                onKeyDown={handleKeyDown.bind(this)}
            />
            <CustomAlert message={showText} type={showType} ref={alertRef} />
            <div className="container p-0">
                <div className="my-body" onClick={handleBodyClick}>
                    <div className="row p-0 g-0 mb-0 mt-3">
                        <div className="col-12 d-flex justify-content-between align-items-center my-flex-gap">

                            {
                                (taskUid === '') &&
                                <div className="my-body-title roboto-h2">
                                    Add AI task
                                </div>
                            }


                            {
                                (taskUid !== '') &&
                                <div className="my-body-title roboto-h2">
                                    Edit {taskName}
                                </div>
                            }


                            <div className='d-flex justify-content-start align-items-center'>
                                {
                                    (taskUid !== '') &&
                                    <CustomButton name='delete' onClick={handleShowDeleteModal}></CustomButton>
                                }

                            </div>
                        </div>
                    </div>

                    <div className="row py-0">
                        <div className="col-12" style={{height:20}}>
                            <hr className="my-divider" />
                        </div>
                    </div>


                    <div className="row mb-2 p-2">
                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap py-2">
                            <div className="my-sub-title">
                                General
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap gap-3 py-2 ">
                            <div>
                                <div className='my-input-title roboto-b2 py-1' ref={taskTitleRef}>
                                    AI task name *
                                </div>
                                <div>
                                    <CustomInput defaultValue={taskName} width="240" height="52" ref={taskNameRef} onChange={() => { }}></CustomInput>
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1 d-flex flex-row justify-content-between align-items-center'>
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

                                    {/* <CustomSelectSource name={sourceContent} width="240" height="52" fontSize="16" ref={sourceRef} onListboxOpenChange={handleSourceMenuToggle} placeHolder={true} disabled={(taskUid === '') ? false : true} /> */}
                                    <CustomSelectSource name={sourceContent} width="240" height="52" fontSize="16" ref={sourceRef} onListboxOpenChange={handleSourceMenuToggle} placeHolder={true} sourceMenu={sourceMenu} />
                                </div>
                                <div className='position-relative'>
                                    {
                                        sourceMenu &&

                                        <SourcePanel onClose={handleSourcePanelClose} />

                                    }
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Model *
                                </div>
                                <div>

                                    {
                                        (taskUid !== '') &&
                                        <CustomSelect areaArr={modelArr} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleModelChange} placeHolder={false} ref={modelRef} defaultValue={selectedModel} disabled={true} name="model"></CustomSelect>
                                    }
                                    {
                                        (taskUid === '') &&
                                        <CustomSelectModel areaArr={modelArr} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleModelChange} placeHolder={true} ref={modelRef} disabled={false} name="model" importModel={handleImportModel} modelDelete={handleModelDelete}></CustomSelectModel>
                                    }
                                </div>
                            </div>
                            <div>
                                <div className='my-input-title roboto-b2 py-1'>
                                    Application *
                                </div>
                                <div>
                                    {
                                        (taskUid !== '') &&
                                        <CustomSelect areaArr={applicationOptions} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleApplicationChange} placeHolder={false} ref={applicationRef} name="application"></CustomSelect>
                                    }
                                    {
                                        (taskUid === '') &&
                                        <CustomSelect areaArr={applicationOptions} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleApplicationChange} placeHolder={true} ref={applicationRef} name="application"></CustomSelect>
                                    }

                                </div>
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-start align-items-center my-flex-gap gap-3 mt-3">
                            <div>
                                <div className='my-input-title roboto-b2 py-1' ref={confidenceTitleRef}>
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
                                    {
                                        (taskUid !== '') &&
                                        <CustomSelect areaArr={deviceArr} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleAcceleratorsChange} placeHolder={false} ref={deviceRef} defaultValue={selectedDevice} disabled={true} name="device"></CustomSelect>
                                    }
                                    {
                                        (taskUid === '') &&
                                        <CustomSelect areaArr={deviceArr} width="240" height="52" fontSize="16" className="my-dropdown-select" onChange={handleAcceleratorsChange} placeHolder={true} ref={deviceRef} defaultValue={selectedDevice} disabled={false} name="device"></CustomSelect>
                                    }

                                </div>
                            </div>

                        </div>
                    </div>



                    <div className="row py-3 mt-0">
                        <div className="col-12" style={{height:20}}>
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

                        <div className="row p-2 g-0 my-2 mb-4 mt-0">
                            <div className="col-12 d-flex justify-content-between my-area-container bdr">

                                <table className='w-100' style={{ border: '1px' }}>
                                    <tbody>
                                        <tr>
                                            {
                                                (!basicType) &&

                                                <td className='my-area-p3-a'>
                                                    <div className='w-100 h-100 d-flex flex-column p-0 align-items-center'>
                                                        <DrawingTooltip title="Select area">
                                                            <ToolIcon_Point className={mode === 'select' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleSelectMode} ref={KeySRef} />
                                                        </DrawingTooltip>

                                                        <DrawingTooltip title="Edit area">
                                                            <ToolIcon_Pen className={mode === 'edit' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleEditMode} ref={KeyERef} />
                                                        </DrawingTooltip>

                                                        <DrawingTooltip title="Add new area">
                                                            <ToolIcon_Pen_Add className={mode === 'add' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleAddMode} ref={KeyARef} />
                                                        </DrawingTooltip>

                                                        {
                                                            linePanel &&
                                                            <DrawingTooltip title="Set line">
                                                                <ToolIcon_Line className={mode === 'line' ? "my-tool-icon-selected p-0 mt-3 mb-1" : "my-tool-icon p-0 mt-3 mb-1"} onClick={handleLineMode} ref={KeyLRef} />
                                                            </DrawingTooltip>
                                                        }

                                                        <DrawingTooltip title="Delete">
                                                            <ToolIcon_Delete className={mode === 'select' ? "my-tool-icon p-0 mt-3 mb-1" : "my-tool-icon-disable p-0 mt-3 mb-1"} onClick={handleDeleteMode} ref={KeyDRef} />
                                                        </DrawingTooltip>
                                                    </div>
                                                </td>
                                            }
                                            <td className='my-area-p3-b' style={{ background: (basicType) ? 'black' : 'white' }}>
                                                <div className='w-100 d-flex flex-column align-items-center justify-content-center'>
                                                    {
                                                        (fileUrl === '') &&
                                                        <Image_Default style={{ width: (basicType) ? 854 : 800, height: 560, background: 'white', border: '0px solid white' }} />
                                                    }

                                                    {/* {
                                                        ((fileUrl !== '') && (basicType)) &&

                                                        // 
                                                        <img src={fileUrl}></img>
                                                    } */}

                                                    {
                                                        // ((fileUrl !== '') && (!basicType)) &&
                                                        (fileUrl !== '') &&
                                                        <CustomDrawing
                                                            src={fileUrl}
                                                            width={(basicType) ? (drawWidth + 50) : drawWidth}
                                                            height={drawHeight}
                                                            mode={mode}
                                                            setMode={handleChangeMode}
                                                            areaArr={areaArr}
                                                            showAppSetting={showAppSetting}
                                                            onDrawLineComplete={handleDrawLineComplete}
                                                            basicType={basicType}
                                                            ref={customDrawingRef}
                                                        >
                                                        </CustomDrawing>
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
                                                        <DependOnSelectPanel linePanel={linePanel} basicType={basicType} ref={dependOnTitle} areaDependOn={areaDependOn} />
                                                        {/* <DependOnSelectPanel dependOn={[]} linePanel={linePanel}/> */}
                                                    </div>

                                                    {
                                                        linePanel &&
                                                        <LinePanel ref={linePanelRef} setLineMode={handleLineMode} />
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
                        ((!showAppSetting) && (taskUid === '')) &&
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

                            <CustomButton name='cancel' onClick={handleCancelClick}></CustomButton>

                            <CustomButton name={(taskUid === '') ? 'submit' : 'save'} onClick={handleSubmit} disabled={!showAppSetting}></CustomButton>
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
                            <div className='col-12 roboto-h2 p-0'>
                                <div>
                                    Rename
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-b1 p-0' style={{ color: 'var(--on_color_2)' }}>
                                <div style={{ paddingTop: 24}}>
                                    Area name
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0'>
                                <div style={{ paddingTop: 5}}>
                                    <CustomInput width="418" height="52" defaultValue={modifyAreaName} ref={areaRenameRef} onChange={() => { }} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                        <div className='col-12 d-flex justify-content-end' style={{padding:0}}>
                                <div style={{ paddingTop: 145 }} className='d-flex gap-3'>
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


            <Modal
                open={showTaskDeleteModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 400 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0' style={{ paddingTop: 20}}>
                                <div>
                                    Delete {taskName}
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-b1 p-0' style={{ color: 'var(--on_color_1)' }}>
                                <div style={{ paddingTop: 24}}>
                                    {taskName} will be deleted.
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end' style={{padding:0}}>
                                <div style={{ paddingTop: 205}} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowTaskDeleteModal(false);
                                    }} />
                                    <CustomButton name="delete" onClick={handleDelete} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>

            <Modal
                open={showModelDeleteModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 400 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0'>
                                <div>
                                    Delete {deleteModelName}
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-b1 p-0' style={{ color: 'var(--on_color_1)' }}>
                                <div style={{ paddingTop: 24}}>
                                    {deleteModelName} will be deleted.
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end' style={{padding:0}}>
                                <div style={{ paddingTop: 205 }} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowModelDeleteModal(false);
                                    }} />
                                    <CustomButton name="delete" onClick={handleModelDeleteExecute} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>



            <Modal
                open={showLoadingModal}
            >
                <ModalDialog
                    sx={{ minWidth: 200, maxWidth: 200, minHeight: 200,layout:'center' }}
                >
                    
                        <div style={{width:0, height:0,background: 'white'}}>
                            <CustomLoading />
                        </div>
                    
                    
                </ModalDialog>
            </Modal>


            <input type="file" name="files" onChange={handleFileChange} ref={fileRef} style={{ visibility: 'hidden', width: '0px', height: '0px' }} />
        </SimpleLayout>
    );
}

export default EditAiTask;
