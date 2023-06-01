import React,{useEffect} from 'react';
import log from "../../utils/console";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersViewfinder, faArrowsToEye, faCarSide , faLandmark , faQuestion } from '@fortawesome/free-solid-svg-icons';

import {ReactComponent as App_Basic_Classification}  from '../../assets/App_Basic_Classification.svg';
import {ReactComponent as App_Basic_Object_Detection}  from '../../assets/App_Basic_Object_Detection.svg';
import {ReactComponent as App_Basic_Segmentation}  from '../../assets/App_Basic_Segmentation.svg';
import {ReactComponent as App_Movement_Zone}  from '../../assets/App_Movement_Zone.svg';
import {ReactComponent as App_Tracking_Zone}  from '../../assets/App_Tracking_Zone.svg';
import {ReactComponent as App_Detection_Zone}  from '../../assets/App_Detection_Zone.svg';



const AppIcon = (props) => {

    const nameApplication=props.nameApplication.toString().toLowerCase();

    if (nameApplication === 'basic_classification') {
        return (
            <div>
                <App_Basic_Classification/>
            </div>
        );
    }

    if (nameApplication === 'basic_object_detection') {
        return (
            <div>
                <App_Basic_Object_Detection/>
            </div>
        );
    }

    if (nameApplication === 'basic_segmentation') {
        return (
            <div>
                <App_Basic_Segmentation/>
            </div>
        );
    }

    if (nameApplication === 'movement_zone') {
        return (
            <div>
                <App_Movement_Zone/>
            </div>
        );
    }

    if (nameApplication === 'tracking_zone') {
        return (
            <div>
                <App_Tracking_Zone/>
            </div>
        );
    }

    if (nameApplication === 'detection_zone') {
        return (
            <div>
                <App_Detection_Zone/>
            </div>
        );
    }

    return (
        <div className="my-model-icon">
            <FontAwesomeIcon icon={faQuestion} className="fa-2x" />
        </div>
    );

   
};



export default AppIcon;