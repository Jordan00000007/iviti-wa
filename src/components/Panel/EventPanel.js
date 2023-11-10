import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";

import styled from 'styled-components';
import EventToggle from '../../components/Buttons/EventToggle';
import CustomSelectLogic from '../../components/Dropdowns/CustomSelectLogic';
import CustomInput from '../../components/Inputs/CustomInput';
import CustomInputMultiLine from '../../components/Inputs/CustomInputMultiLine';
import CustomInputSmall from '../../components/Inputs/CustomInputSmall';

import { eventToggleUpdate, eventTitleUpdate, eventLogicUpdate, eventValueUpdate } from "../../store/areas";

const Button = styled.div`
    background-color: ${(props) => { return (props.selected) ? '#16272E0F' : 'white' }};
    color: ${(props) => { return (props.selected) ? '#16272E' : '#16272E52' }};
    font-size: 18px;
    width:144px;
    height:36px;
    padding: 5px 6px;
    border-top: 1px solid #16272ED9;
    border-bottom: 1px solid #16272ED9;
    border-left: 1px solid #16272ED9;
    border-right: ${(props) => { return (props.position === 'L') ? '0px' : '1px solid #16272ED9' }};
    border-radius: ${(props) => { return (props.position === 'L') ? '6px 0px 0px 6px' : '0px 6px 6px 0px' }};
    cursor:pointer;
    text-align:center;
    ${(props) => {
        return (!props.selected) ? `
        &:hover {
            color: #16272E;
            background-color: #16272E03;
        }
    `: ''
    }}
    `;

const EventPanel = forwardRef((props, ref) => {

    const { _eventPanelRef, _eventPanelDescriptionRef, _eventPanelEnableRef, _eventPanelTitleRef, _eventPanelLogicRef, _eventPanelValueRef } = ref;

    const [eventTitleWarnning, setEventTitleWarnning] = useState(false);
    const [eventLogicWarnning, setEventLogicWarnning] = useState(false);
    const [eventValueWarnning, setEventValueWarnning] = useState(false);
    const [eventDescriptionWarnning, setEventDescriptionWarnning] = useState(false);

    const [logicArr, setLogicArr] = useState([['>', '>'], ['=', '='], ['<', '<']]);

    const dispatch = useDispatch();

    const eventConfigArr = useSelector((state) => state.areas.eventConfigArr);
    const areaEditingIndex = useSelector((state) => state.areas.areaEditingIndex);

    const isNumeric = (value) => {
        return /^-?\d+$/.test(value);
    }

    const handleLogicChange = (event, value) => {
        dispatch(eventLogicUpdate(value));
    }

    const handleEventTitleChange = (value) => {
        dispatch(eventTitleUpdate(value));
    }

    const handleEventValueChange = (value) => {
        dispatch(eventValueUpdate(value));
    }

    const handleToggleChange = (event, value) => {

        dispatch(eventToggleUpdate(value));
    }

    useEffect(() => {

        log('props.selectedApplication', props.selectedApplication)
        if ((props.selectedApplication === 'Tracking_Zone') || (props.selectedApplication === 'Movement_Zone')) {
            setLogicArr([['>', '>'], ['=', '=']]);
        } else {
            setLogicArr([['>', '>'], ['=', '='], ['<', '<']]);
        }

    }, [props.selectedApplication]);


    useEffect(() => {

        _eventPanelLogicRef.current.setSelectedValue(eventConfigArr[areaEditingIndex].logic_operator);
        _eventPanelTitleRef.current.setInputValue(eventConfigArr[areaEditingIndex].title);
        _eventPanelValueRef.current.setInputValue(eventConfigArr[areaEditingIndex].logic_value);
        _eventPanelEnableRef.current.setChecked(eventConfigArr[areaEditingIndex].enable);

    }, [eventConfigArr, areaEditingIndex]);

    useImperativeHandle(_eventPanelRef, () => ({

        setEventTitleWarnning: (myValue) => {
            setEventTitleWarnning(myValue);
        },
        setEventLogicWarnning: (myValue) => {
            setEventLogicWarnning(myValue);
        },
        setEventValueWarnning: (myValue) => {
            setEventValueWarnning(myValue);
        },
        setRemoveAllWarnning: () => {
            setEventTitleWarnning(false);
            setEventLogicWarnning(false);
            setEventValueWarnning(false);
            _eventPanelTitleRef.current.setWarnning(false);
            _eventPanelLogicRef.current.setWarnning(false);
            _eventPanelValueRef.current.setWarnning(false);
        }

    }));

    return (
        <div className='my-area-p3-c5'>
            <div className="row ">
                <div className="col-12 d-flex justify-content-between align-items-center mt-2">
                    <div className='d-flex flex-row gap-2 my-middle-title' ref={_eventPanelDescriptionRef}>
                        Set Condition
                    </div>
                    <div>
                        <EventToggle status={(eventConfigArr[areaEditingIndex].enable) ? 'run' : 'stop'} onChange={handleToggleChange} ref={_eventPanelEnableRef}></EventToggle>
                    </div>
                </div>
                <div className="col-12 d-flex justify-content-start mt-2">
                    <div className={(eventTitleWarnning) ? 'd-flex flex-row gap-2 my-small-title-warnning' : 'd-flex flex-row gap-2 my-small-title'}>
                        Event title
                    </div>
                </div>
                <div className="col-12 d-flex justify-content-start ">
                    <div className='d-flex flex-row gap-2'>
                        <CustomInputMultiLine width="280" height="72" onChange={handleEventTitleChange} defaultValue={eventConfigArr[areaEditingIndex].title} ref={_eventPanelTitleRef}></CustomInputMultiLine>
                    </div>
                </div>
                <div className="col-12 d-flex justify-content-between mt-2">
                    <div className='d-flex flex-column'>
                        <div className={(eventLogicWarnning) ? 'my-small-title-warnning' : 'my-small-title'}>Logic</div>
                        <CustomSelectLogic areaArr={logicArr} onChange={handleLogicChange} width="130" height="36" ref={_eventPanelLogicRef}></CustomSelectLogic>
                    </div>
                    <div className='d-flex flex-column'>
                        <div className={(eventValueWarnning) ? 'my-small-title-warnning' : 'my-small-title'}>Value</div>
                        <CustomInput width="130" height="36" onChange={handleEventValueChange} defaultValue={eventConfigArr[areaEditingIndex].logic_value} ref={_eventPanelValueRef} ></CustomInput>
                    </div>
                </div>
            </div>
        </div>
    )


});

export default EventPanel;