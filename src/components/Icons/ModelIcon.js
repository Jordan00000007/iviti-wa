import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsersViewfinder, faArrowsToEye, faCarSide , faLandmark , faQuestion } from '@fortawesome/free-solid-svg-icons';




const ModelIcon = (props) => {

    const { nameModel } = props;

    if (nameModel === 'yolo-v3-tf') {
        return (
            <div className="my-model-icon" style={{background:'var(--vivid_4)'}}>
                <FontAwesomeIcon icon={faUsersViewfinder} className="fa-2x" />
            </div>
        );
    }

    if (nameModel === 'yolo-v4-tiny-tf') {
        return (
            <div className="my-model-icon" style={{background:'var(--vivid_3)'}}>
                <FontAwesomeIcon icon={faArrowsToEye} className="fa-2x" />
            </div>
        );
    }

    if (nameModel === 'resnet_v1_50_inference') {
        return (
            <div className="my-model-icon" style={{background:'var(--vivid_2)'}}>
                <FontAwesomeIcon icon={faCarSide} className="fa-2x" />
            </div>
        );
    }

    if (nameModel === 'Model_4') {
        return (
            <div className="my-model-icon" style={{background:'var(--vivid_1)'}}>
                <FontAwesomeIcon icon={faLandmark} className="fa-2x" />
            </div>
        );
    }



    
    return (
        <div className="my-model-icon">
            <FontAwesomeIcon icon={faQuestion} className="fa-2x" />
        </div>
    );

   
};



export default ModelIcon;