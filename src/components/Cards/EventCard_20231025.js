import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

import moment from "moment"

import log from "../../utils/console";
import AppIcon from '../Icons/AppIcon'
import CustomButton from '../Buttons/CustomButton';
import StatusButton from '../Buttons/StatusButton';
import ToggleButton from '../Buttons/ToggleButton';
import SmallShot from '../Screenshots/SmallShot';
import CustomTooltip from '../Tooltips/CustomTooltip';

import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


import { Link } from 'react-router-dom';


import { useSelector, useDispatch } from "react-redux";


const EventCard = (props) => {

    // const [name, setName] = useState("");

    
    const TASK_SERVER = process.env.REACT_APP_TASK_SERVER;

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [data, setData] = useState(null);


    const init = [];
    const [state, setState] = useState(init);
    const dummyState = useRef(init);
    const toggleRef = useRef(null);


    const handleCardClick = (event) => {
        
        props.onClick(props.data);
    }

    const formatEventTime = (myStartTime) => {

        if (myStartTime!==undefined){
            return moment(parseInt(myStartTime.toString().slice(0,13))).format("YYYY-MM-DD HH:mm:ss");
        }else{
            return "N/A";
        }
    
        
    }



 
    return (
        <div className="card border-0" style={{ marginTop: 16, marginLeft: 14 }}>
            <div className="card-body my-event-card" style={{ cursor: 'pointer' }} >
                <div className="row gy-0">

                    <div className="col-12" onClick={handleCardClick}>

                        <div className="row">
                            <div className="col-12 d-flex flex-row gap-2">
                                <div>
                                
                                    <div style={{ width: 66, height:66, background: 'black', border: '0px' }} className='d-flex align-items-center'>
                                        <img src={props.data.imgBase64_1} style={{ maxWidth: 66, maxHeight: 66 }}/>
                                    </div> 
                                    
                                </div>
                                <div className="d-flex flex-column" style={{ position: 'relative' }}>

                                    <div className='roboto-h5' style={{ position: 'absolute', top: -4, width: 218, height: 22, color: '#16272E' }}>

                                        <CustomTooltip customClassName='roboto-h5 my-event-card-title'>
                                            {props.data.title}
                                        </CustomTooltip>


                                    </div>

                                    <div className='roboto-b2' style={{ position: 'absolute', top: 24, width: 218, height: 18, color: '#16272E' }}>
                                        {props.data.annotation.area.name}
                                    </div>

                                    <div className='roboto-b2' style={{ position: 'absolute', top: 48, width: 218, height: 18, color: '#16272E66' }}>
                                        
                                        {formatEventTime(props.data.start_time)}
                                    </div>

                                    <div style={{ position: 'absolute', top: 48, left: 160 }}>
                                        <div className='roboto-b2 my-event-card-button' style={{position:'relatvie'}}>
                                            <span style={{position:'absolute',top:1,left:9}}>
                                                view&nbsp;
                                            </span>
                                            <span style={{position:'absolute',top:1,left:42}}>
                                                <Arrow/>
                                            </span>
                                        </div>
                                        
                                    </div>





                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};



export default EventCard;