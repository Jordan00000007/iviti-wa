import React, { useRef, useEffect, forwardRef, useState,useImperativeHandle } from 'react';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomInput from '../../components/Inputs/CustomInput';
import { useSelector, useDispatch } from "react-redux";
import { lineARelationUpdate, lineBRelationUpdate } from "../../store/areas";
import { ReactComponent as ToolIcon_Line } from '../../assets/Icon_Line.svg';

const LinePanel = forwardRef((props, ref) => {

    const { _linePanelRef, _linePanelInput01Ref, _linePanelInput02Ref, _linePanelTitleRef, _linePanelDescriptionRef } = ref;

    //const [lineRelationArr, setLineRelationArr] = useState([['','']])
    //lineRelationArr
    const lineNameArr = useSelector((state) => state.areas.lineNameArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);
    const lineRelationArr = useSelector((state) => state.areas.lineRelationArr);
    const linePointArr= useSelector((state) => state.areas.linePointArr);

    const [ready, setReady] = useState(false);
    const [titleWarnning, setTitleWarnning] = useState(false);
    const [descriptionWarnning, setDescriptionWarnning] = useState(false);

    const dispatch = useDispatch();


    const handleInput1Change = (value) => {
        dispatch(lineARelationUpdate(value));
    }

    const handleInput2Change = (value) => {
        dispatch(lineBRelationUpdate(value));
    }

    useEffect(() => {

        log('line areaEditingIndex change')
        // log(linePointArr[areaEditingIndex][0].length)
        // log(linePointArr[areaEditingIndex][1].length)

        if ((linePointArr[areaEditingIndex][0])&&(linePointArr[areaEditingIndex][1])){
            if ((linePointArr[areaEditingIndex][0].length===4)&&(linePointArr[areaEditingIndex][1].length===4)){
                setReady(true);
            }else{
                setReady(false);
            }
        }else{
            setReady(false);
        } 

    }, [linePointArr,areaEditingIndex]);


    useImperativeHandle(_linePanelRef, () => ({
        getReady: () => {
           return ready;
        },
        setTitleWarnning:(myValue)=>{
            setTitleWarnning(myValue);
        },
        setDescriptionWarnning:(myValue)=>{
            setDescriptionWarnning(myValue);
        }
     
    }));



    return (
        <div className='my-area-p3-c3'>
            <div className={titleWarnning?'my-area-p3-c3-1 roboto-h5 my-warnning':'my-area-p3-c3-1 roboto-h5'} ref={_linePanelTitleRef}>
                Line relation (required)
            </div>
            {
            ready &&
            <>
                <div className='my-area-p3-c3-2 d-flex flex-row'>
                    <LabelButton name={lineNameArr[areaEditingIndex][0]} width="74" height="36" type="line"></LabelButton>
                    <LabelButton name={lineNameArr[areaEditingIndex][1]} width="74" height="36" type="line"></LabelButton>
                    <CustomInput placeholder="Southward" width="112" height="36" ref={_linePanelInput01Ref} defaultValue={lineRelationArr[areaEditingIndex][0]} onChange={handleInput1Change}></CustomInput>
                </div>
                <div className='my-area-p3-c3-3 d-flex flex-row'>
                    <LabelButton name={lineNameArr[areaEditingIndex][1]} width="74" height="36" type="line"></LabelButton>
                    <LabelButton name={lineNameArr[areaEditingIndex][0]} width="74" height="36" type="line"></LabelButton>
                    <CustomInput placeholder="Northward" width="112" height="36" ref={_linePanelInput02Ref} defaultValue={lineRelationArr[areaEditingIndex][1]} onChange={handleInput2Change}></CustomInput>
                </div>
            </>
            }
            {
            (!ready) &&
            <>
                <div className='my-area-p3-c3-2 d-flex flex-column justify-content-center align-items-center' ref={_linePanelDescriptionRef}>
                    <ToolIcon_Line className='my-tool-icon p-0 mb-1' onClick={props.setLineMode}/>
                    <div className={(descriptionWarnning)?"roboto-b1 my-line-panel-description-warnning":"roboto-b1 my-line-panel-description"}>Use line tool to draw 2 lines</div>
                    <div className={(descriptionWarnning)?"roboto-b1 my-line-panel-description-warnning":"roboto-b1 my-line-panel-description"}>and set relation between them.</div>
                </div>
              
            </>
            }
        </div>
    )
});

export default LinePanel;