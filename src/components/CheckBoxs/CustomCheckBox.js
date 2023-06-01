import React, { useState, useEffect } from 'react';
import { ReactComponent as CheckBox_Empty } from '../../assets/Icon_Checkbox_Empty.svg';
import { ReactComponent as CheckBox_Selected } from '../../assets/Icon_Checkbox_Selected.svg';
import log from "../../utils/console";

const CustomCheckBox = (props) => {
    // const [isChecked, setIsChecked] = useState(true);

   

    useEffect(() => {

    }, []);


    return (

        <div onClick={props.onClick} style={{ cursor: 'pointer' }}>
            {
                (props.checked) ? <CheckBox_Selected /> : <CheckBox_Empty />
            }

        </div>
    );
}

export default CustomCheckBox;