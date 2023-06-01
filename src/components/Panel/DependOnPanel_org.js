import React,{ useState,useEffect } from 'react';
import { useSelector } from "react-redux";
import log from "../../utils/console";
import CustomSelect from '../../components/Dropdowns/CustomSelect';
import CustomSelect2 from '../../components/Dropdowns/CustomSelect2';
import LabelPanel from '../../components/Panel/LabelPanel';

const DependOnPanel = (props) => {

    const [areaIndex, setAreaIndex] = useState(0);
    const [areaNameArr, setAreaNameArr] = useState([]);
    const [dependOnArr, setDependOnArr] = useState([]);

    const handleSelectChange = (event,value) => {
        log(`--- select change to index ${value} ---`);
        setAreaIndex(value);
    };

    const myData = useSelector((state) => state.tasks.data);
    const myIndex = myData.findIndex(item => item.uuid === props.uuid);
    const myItem = myData[myIndex];

    useEffect(() => {

        const myAreaPoints = myItem.application.area_points;
        let i = 1;
        let myAreaNameArr=[];
        let myDependOnArr=[];
        for (const ele in myAreaPoints) {
            if (myAreaPoints[ele].length > 0) {
                myAreaNameArr.push(`Area ${i}`)
                i++;

                const myDependOn = myItem.application.depend_on;
                myDependOnArr.push(myDependOn)
              
            }
        }


        // 測試用
        if (myItem.name === "object-detection-sample") {
            myAreaNameArr.push(`Area 1`)
            const myDependOn = myItem.application.depend_on;
            myDependOnArr.push(myDependOn)

        }
        
        setAreaNameArr(myAreaNameArr);
        setDependOnArr(myDependOnArr);

        log(myDependOnArr)
        
     
    }, []);


    const handleLabelExpandClick=()=>{
        log('expand label')
    }


    return (
        <div className='my-area-b2'>
            <div className='my-area-b2-1 d-flex justify-content-between align-items-center'>
                <div className='my-area-b2-1-1 roboto-h5'>
                    Depend on
                </div>
                <div className='my-area-b2-1-2 d-flex justify-content-end'>
                    <CustomSelect areaArr={areaNameArr} width="140" height="32" fontSize="15" onChange={handleSelectChange} />
                </div>
            </div>
            <div className='my-area-b2-2'>
                <div className='my-area-b2-2-1'>
                    <LabelPanel dependOnArr={dependOnArr} index={areaIndex} area={areaNameArr[areaIndex]} onClick={props.onClick}/>
                </div>
            </div>
        </div>
    )
}

export default DependOnPanel;