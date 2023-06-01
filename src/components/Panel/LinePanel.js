import React, { useRef, useEffect, forwardRef, useState } from 'react';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomInput from '../../components/Inputs/CustomInput';
import { useSelector, useDispatch } from "react-redux";
import { lineARelationUpdate, lineBRelationUpdate } from "../../store/areas";

const LinePanel = forwardRef((props, ref) => {

    const { line1Ref, line2Ref, lineTitleRef } = ref;

    //const [lineRelationArr, setLineRelationArr] = useState([['','']])
    //lineRelationArr
    const lineNameArr = useSelector((state) => state.areas.lineNameArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);
    const lineRelationArr = useSelector((state) => state.areas.lineRelationArr);

  
    const dispatch = useDispatch();


    const handleInput1Change = (value) => {
        dispatch(lineARelationUpdate(value));
    }

    const handleInput2Change = (value) => {
        dispatch(lineBRelationUpdate(value));
    }

    useEffect(() => {

        log('line areaEditingIndex change')

        //line1Ref.current.defaultValue=lineRelationArr[areaEditingIndex];

    }, [areaEditingIndex]);

    // useEffect(() => {
    //     setLineRelationArr(lineRelation);
    // }, [lineRelation]);



    return (
        <div className='my-area-p3-c3'>
            <div className='my-area-p3-c3-1 d-flex flex-row roboto-h5' ref={lineTitleRef}>
                Line relation (required)
            </div>
            <div className='my-area-p3-c3-2 d-flex flex-row'>
                <LabelButton name={lineNameArr[areaEditingIndex][0]} width="74" height="36" type="line"></LabelButton>
                <LabelButton name={lineNameArr[areaEditingIndex][1]} width="74" height="36" type="line"></LabelButton>
                <CustomInput placeholder="Southward" width="112" height="36" ref={line1Ref} defaultValue={lineRelationArr[areaEditingIndex][0]} onChange={handleInput1Change}></CustomInput>
            </div>
            <div className='my-area-p3-c3-3 d-flex flex-row'>
                <LabelButton name={lineNameArr[areaEditingIndex][1]} width="74" height="36" type="line"></LabelButton>
                <LabelButton name={lineNameArr[areaEditingIndex][0]} width="74" height="36" type="line"></LabelButton>
                <CustomInput placeholder="Northward" width="112" height="36" ref={line2Ref} defaultValue={lineRelationArr[areaEditingIndex][1]} onChange={handleInput2Change}></CustomInput>
            </div>
        </div>
    )
});

export default LinePanel;