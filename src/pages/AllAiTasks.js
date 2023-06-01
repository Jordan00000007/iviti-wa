import '../css/App.css';
import React, {useEffect, useState,useRef} from 'react';
import log from "../utils/console";
import SimpleLayout from '../components/Layouts/SimpleLayout';
import CustomButton from '../components/Buttons/CustomButton';
import TaskCard from '../components/Cards/TaskCard';
import CustomAlert from '../components/Alerts/CustomAlert';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchData } from "../store/tasks";
import { resetFileName } from "../store/sources";




function AllAiTasks() {

  
    const [showType, setShowType] = useState(0);
    const [showText, setShowText] = useState('');

    const alertRef = useRef();
  
    const dispatch = useDispatch();
    const myData = useSelector((state) => state.tasks.data);
    const myStatus = useSelector((state) => state.tasks.status);

    const setMessageOpen=(showType,showText)=>{
        
        setShowType(showType);
        setShowText(showText);
        alertRef.current.setShowTrue();
       
    };

    const handleClickAdd = () => {
        log('Add Button clicked!');
        setMessageOpen(0,'Add Button clicked!');
     
    };
   
    useEffect(() => {
        dispatch(fetchData());

        dispatch(resetFileName());
    }, []);
    

    if (myStatus === 'success') 
    return (
        <SimpleLayout>
            <CustomAlert message={showText} type={showType} ref={alertRef}/>
            <div className="container p-0">
                <div className="my-body">

                 
                    <div className="row p-0 g-0 mb-3 mt-3">
                        <div className="col-12 d-flex justify-content-between">
                            <div className="my-body-title roboto-h2">
                                All AI Tasks
                            </div>
                            <Link to="/addTask">
                                <CustomButton onClick={handleClickAdd} disabled={false} name="add" />
                            </Link>
                        </div>
                    </div>
                    <div className="row gy-4">
                        {myData.map(item => (
                            <div className="col-3" key={item.task_uid}>
                                <TaskCard 
                                    task_uid={item.task_uid} 
                                    nameTask={item.task_name} 
                                    nameApplication={item.app_name} 
                                    nameModel={item.model_name} 
                                    nameStatus={item.status}
                                    showMessage={setMessageOpen}
                                ></TaskCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </SimpleLayout>
    );

    return (
        <SimpleLayout>
        </SimpleLayout>
    )

}

export default AllAiTasks;
