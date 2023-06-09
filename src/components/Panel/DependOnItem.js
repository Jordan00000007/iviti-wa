import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomInput from '../../components/Inputs/CustomInput';
import CustomCheckBox from '../../components/CheckBoxs/CustomCheckBox';
import CustomTooltip from '../../components/Tooltips/CustomTooltip';

import { toggleSelectAll,toggleDependOnItem } from "../../store/areas";

const DependOnItem = (props) => {

    const dispatch = useDispatch();

    const [areaDependOnItem, setAreaDependOnItem] = useState({});

    useEffect(() => {
       
        setAreaDependOnItem(props.data);
        
    }, [props]);

    const toggleCheckBox = (event,checked) => {
        
        dispatch(toggleDependOnItem(props.data));

    }

    const handleColorChange= (event) => {
        
        log('handle color change')
        log(event.target.style.background)
        log(event.target.getAttribute('name'))

        const myColor=event.target.style.background;
        const myName=event.target.getAttribute('name');
        props.onColorChange(myName,myColor)

    }

    return (
        <div>
            <div className="row ">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div className='d-flex flex-row gap-2 align-items-center'>
                        <div>
                            <div style={{ width: 20, height: 20, background: areaDependOnItem.color, borderRadius: 6,cursor:'pointer'}} onClick={handleColorChange} name={areaDependOnItem.name}/>
                        </div>
                        <div style={{ width: 210 }}>
                            <CustomTooltip>
                                {areaDependOnItem.name}
                            </CustomTooltip>
                        </div>
                    </div>

                    <div>
                        <CustomCheckBox checked={areaDependOnItem.checked} onClick={toggleCheckBox} />
                    </div>
                </div>
            </div>
            <hr className="my-divider" style={{ marginTop: 4, marginBottom: 4 }} />
        </div>
    )
}

export default DependOnItem;