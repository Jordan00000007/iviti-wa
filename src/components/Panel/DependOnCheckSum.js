import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";

const DependOnCheckSum = (props) => {

    const dispatch = useDispatch();

    //const areaDependOn = useSelector((state) => state.areas.areaDependOn);
    //const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);

    const [checkSum, setCheckSum] = useState(0);

    useEffect(() => {

        const areaDependOn = props.areaDependOn;
        const areaEditingIndex = props.areaEditingIndex;

        let total = 0;
        if (areaEditingIndex>=0){
            areaDependOn[areaEditingIndex].forEach((item) => {
                if (item.checked) total++;
            })
        }
        setCheckSum(total);
        
    }, [props]);


    return (
        <>
            <span className="badge rounded-pill" style={{ fontSize: 15, background: 'var(--highlight_1)', paddingTop: 7 }}>
                {checkSum}
            </span>
        </>
    )
}

export default DependOnCheckSum;