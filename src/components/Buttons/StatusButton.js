import React from 'react';
import log from "../../utils/console";
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const StatusButton = ({ name }) => {

   // const {name}=props;
  
        if (name==="running"){
            return (
                <button className="my-button-run">
                    Run
                </button>
            )
        }

        if (name==="stop"){
            return (
                <button className="my-button-stop">
                    Stop
                </button>
            )
        }

        if (name==="set_task_run_loading"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_task_run_error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_task_run_success"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_task_stop_success"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_task_stop_loading"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_task_stop_error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_run_loading"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_run_error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_stop_success"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_stop_loading"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_stop_error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_add_error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_add_success"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_add_loading"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_delete_loading"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-loading">
                        Loading
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="set_stream_delete_error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }

        if (name==="error"){
            return (
                <div className="my-tooltip-container" data-tooltip-id="my-tooltip-id" data-tooltip-content={name.replaceAll("_"," ")}>
                    <button className="my-button-error">
                        Error
                    </button>
                    <Tooltip id="my-tooltip-id" className="my-tooltip"/>
                </div>
            )
        }



        console.log(`name=${name}`)

       
        return (
            <button className="my-button">
            </button>
        );

       
    
};

export default StatusButton;