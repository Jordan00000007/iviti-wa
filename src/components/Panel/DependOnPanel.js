import React,{ useState,useEffect ,useRef} from 'react';

import log from "../../utils/console";
import CustomSelect from '../../components/Dropdowns/CustomSelect';
import CustomSelect2 from '../../components/Dropdowns/CustomSelect2';
import LabelPanel from '../../components/Panel/LabelPanel';
import { getApplication } from "../../store/applications";
import { useSelector, useDispatch } from "react-redux";

const DependOnPanel = (props) => {

    const [areaIndex, setAreaIndex] = useState(0);
    const [areaNameArr, setAreaNameArr] = useState([]);
    const [dependOnArr, setDependOnArr] = useState([]);

    const areaRef = useRef(null);

    const handleSelectChange = (event,value) => {
        log(`--- select change to index ${value} ---`);
        setAreaIndex(value);
    };

    const myArea = useSelector((state) => state.applications.areas);
   
    const dispatch = useDispatch();

    useEffect(() => {

        let myAreaNameArr=[];
        let myDependOnArr=[];

        myArea.forEach(function (item, index) {
            myAreaNameArr.push([index,item.name]);
            myDependOnArr.push(item.depend_on)
        });
 
        setAreaNameArr(myAreaNameArr);
        setDependOnArr(myDependOnArr);

      
    }, [myArea]);

    useEffect(() => {
        dispatch(getApplication(props.uuid));
    }, []);


    const handleLabelExpandClick=()=>{
        log('expand label')
    }

    useEffect(() => {

        if (areaNameArr.length >0) {
            
            areaRef.current.setSelectedValue(areaNameArr[0][0]);
        }

    }, [areaNameArr]);


    return (
        <div className='my-area-b2'>
            <div className='my-area-b2-1 d-flex justify-content-between align-items-center'>
                <div className='my-area-b2-1-1 roboto-h5'>
                    Depend on
                </div>
                <div className='my-area-b2-1-2 d-flex justify-content-end'>
                    <CustomSelect areaArr={areaNameArr} width="140" height="32" fontSize="15" onChange={handleSelectChange} ref={areaRef} />
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