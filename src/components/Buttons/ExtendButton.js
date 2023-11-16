import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";

import { exportTask } from "../../store/tasks";
import { ReactComponent as Icon_More } from '../../assets/Icon_More.svg';

// function ToggleButton({ onChange, status }) {
const ExtendButton = forwardRef((props, ref) => {

    const [disabled, setDisabled] = useState(false);

    const [showExtendMenu, setShowExtendMenu] = useState(false);

    const [buttonClassName, setButtonClassName] = useState('');

    const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;

    const myData = useSelector((state) => state.tasks.data);

    const dispatch = useDispatch();


    const handleButtonClick = (event) => {
        event.stopPropagation();
        setShowExtendMenu(!showExtendMenu)
    };


    const exportTaskAPI = (myTaskId, myTaskName) => {

        const myData = {};
        myData.uids = myTaskId;
        myData.to_icap = false;
        myData.taskName = myTaskName;

        dispatch(exportTask(myData));

        // const myPayload = {};
        // myPayload.method='POST';
        // myPayload.headers={ "Content-Type": "application/json"}
        // myPayload.body=JSON.stringify(myData);


        // fetch(`${TASK_SERVER}/tasks/export`, myPayload)
        //     .then(response => response.json())
        //     .then(data => 
        //         log('fetch result ---> ',data)
        //     );
    }


    const handleExportClick = (event) => {
        event.stopPropagation();
        log('handle export click')
        log(props.uuid)
        setShowExtendMenu(false);
        exportTaskAPI([props.uuid], props.taskName);
    };

    const handleImportClick = (event) => {
        event.stopPropagation();
        log('handle import click');
        setShowExtendMenu(false);
        props.onImport();
        
    };

    useImperativeHandle(ref, () => ({

        getDisabled: () => {
            return disabled;
        },

    }));


    useEffect(() => {

        switch (props.type) {
            case 1:
                setButtonClassName('my-extend-button-1')
                break;
            case 2:
                setButtonClassName('my-extend-button-2')
                break;
            default:
                setButtonClassName('my-extend-button-2')

        }


    }, [props.type]);

    return (
        <div style={{ position: 'relative', width: 32, height: 32 }}>
            <div className={buttonClassName} onClick={handleButtonClick} style={{ position: 'absolute', left: 0 }}>
                <Icon_More ></Icon_More>
            </div>

            <Icon_More ></Icon_More>
            {
                showExtendMenu ?

                    <div className='my-extend-menu' style={{ position: 'absolute', left: -108, top: 32, zIndex: 5 }} onMouseLeave={(e) => setShowExtendMenu(false)}>

                        {
                            (props.type === 1) &&
                            <div className='my-extend-menu-item' onClick={handleExportClick}>
                                Export
                            </div>

                        }

                        {
                            (props.type === 2) &&
                            <div className='my-extend-menu-item' onClick={handleImportClick}>
                                Import
                            </div>

                        }

                    </div>
                    :
                    <></>
            }

        </div>

    );
});

export default ExtendButton;
