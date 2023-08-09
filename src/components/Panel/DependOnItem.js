import React, { useState,useEffect,useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import LabelButton from '../../components/Buttons/LabelButton';
import CustomInput from '../../components/Inputs/CustomInput';
import CustomCheckBox from '../../components/CheckBoxs/CustomCheckBox';
import CustomTooltip from '../../components/Tooltips/CustomTooltip';
import ColorTooltip from '../../components/Tooltips/ColorTooltip';

import Icon_Edit from '../../assets/Icon_Edit.png';

import { toggleSelectAll,toggleDependOnItem } from "../../store/areas";

const DependOnItem = forwardRef((props, ref) => {

    const dispatch = useDispatch();

    const [areaDependOnItem, setAreaDependOnItem] = useState({});

    const [showEdit, setShowEdit] = useState(false);

    const [colorItem, setColorItem] = useState({"color":null,"name":null,"open":false,"key":-1});

    useEffect(() => {

        setAreaDependOnItem(props.data);
        
    }, [props]);

    const toggleCheckBox = (event,checked) => {
        
        dispatch(toggleDependOnItem(props.data));

    }

    const handleColorChange= (event) => {
        
        // const myColor=props.data.color;
        // const myName=props.data.name;
        // const myKey=props.data.key;
        // const myColorData={};
        // myColorData.color=myColor;
        // myColorData.name=myName;
        // myColorData.key=myKey;
        // if (colorItem.open===true){
        //     myColorData.open=false;
        // }else{
        //     myColorData.open=true;
        // }
        
        // setColorItem(myColorData);
        
    }

    const handleOutSideClick= (event) => {
      
        const myColorData={};
        myColorData.color=colorItem.color;
        myColorData.name=colorItem.name;
        myColorData.key=colorItem.key;
        myColorData.open=false;
        setColorItem(myColorData);
    }

    useImperativeHandle(ref, () => ({

        setClosePalette: () => {
            const myColorData={};
            myColorData.color=colorItem.color;
            myColorData.name=colorItem.name;
            myColorData.key=colorItem.key;
            myColorData.open=false;
            setColorItem(myColorData);
        },
    }));


    return (
        <div>
            <div className="row ">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div className='d-flex flex-row gap-2 align-items-center'>
                        <div>
                            <ColorTooltip colorItem={colorItem} onOutSideClick={handleOutSideClick}>
                                <div>
                                    <div className='my-color-box' style={{ background: areaDependOnItem.color}} onClick={handleColorChange} name={areaDependOnItem.name} key={areaDependOnItem.key} onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
                                        {/* {
                                            (showEdit||(colorItem.open)) &&
                                            <div style={{position:'absolute',top:0,left:0,width:20,height:20,borderRadius:6,background:'#0000001F'}}/>
                                        }
                                        {
                                            (showEdit||(colorItem.open)) &&
                                            <img src={Icon_Edit} style={{position:'absolute',top:0,left:0}}/>
                                        } */}
                                       
                                    </div>
                                </div>
                                
                            </ColorTooltip>
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
})

export default DependOnItem;