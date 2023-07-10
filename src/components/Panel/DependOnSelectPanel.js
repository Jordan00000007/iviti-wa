import React, { useState, useEffect,useRef,forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomInput from '../../components/Inputs/CustomInput';
import DependOnItem from '../../components/Panel/DependOnItem';
import DependOnCheckSum from '../../components/Panel/DependOnCheckSum';

import { toggleSelectAll,toggleDependOnItem } from "../../store/areas";

const DependOnSelectPanel = forwardRef((props, ref) => {

    const dispatch = useDispatch();

    

    const [checkedNum, setCheckedNum] = useState(0);
   
    const [colorList, setColorList] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    //const [areaDependOn, setAreaDependOn] = useState( [[{ "name": "name", "checked": true, "key": 0, "color": "white" }]]);

    const areaDependOn = useSelector((state) => state.areas.areaDependOn);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);

    const handleToggleSelectAll = () => {
     
        dispatch(toggleSelectAll(selectAll));
        
        if(selectAll){
            setSelectAll(false)
        }else{  
            setSelectAll(true)
        }

    }

    // const handleDependOnWarnning = (myTotal) => {
     
    //     log('handle depend on warnning')
    //     if (myTotal===0){
    //         dependOnTitleRef.current.className="roboto-h5 my-warnning";
    //     }else{
    //         dependOnTitleRef.current.className="roboto-h5";
    //     }
    // }


    const handleToggleCheckBox = (idx,checked) => {

        log('handle toggle chekcbox on panel')
      
        let myData=areaDependOn;
        myData[idx].checked=checked;
        props.toggleCheckBox(idx,checked);
        //setAreaDependOn(myData);
    }

    const handleColorChange = (myName,myColor) => {

        log('handle Color Change')
        log(myName)
        log(myColor)
        props.onColorChange(myName,myColor)
      
       
    }

    return (
        <>
            <div className="row ">
                <div className="col-12 d-flex justify-content-between">
                    <div className='d-flex flex-row gap-2'>
                        <div className='roboto-h5' ref={ref}>
                            Depend On
                        </div>
                        <DependOnCheckSum areaDependOn={areaDependOn} areaEditingIndex={areaEditingIndex} ></DependOnCheckSum>
                    </div>
                    <div>
                        <LabelButton name={selectAll?"Select all":"Deselect all"} type="select" height="26" onClick={handleToggleSelectAll} />
                    </div>
                </div>
            </div>
            <hr className="my-divider" style={{ marginTop: 13, marginBottom: 4 }} />

            <div className="row">
                <div className="col-12" style={{maxHeight:props.basicType?(props.linePanel?264:400)+16:(props.linePanel?264:400),minHeight:props.basicType?(props.linePanel?264:400)+16:(props.linePanel?264:400),overflowY:'auto',overflowX:'hidden'}}>

                    {areaDependOn[areaEditingIndex].map((item, idx) => (
                        <DependOnItem data={item} key={idx} index={idx} onClick={handleToggleCheckBox} onColorChange={handleColorChange}/>
                    ))}

                </div>
            </div>

        </>
    )
});

export default DependOnSelectPanel;