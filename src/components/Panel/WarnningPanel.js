import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as Icon_Warnning } from '../../assets/Icon_Warnning.svg';
import styled from 'styled-components';
import log from "../../utils/console";

const WarnningPanel = (props) => {


    return (
        <div className="container" style={{ minHeight: '100%', height: '100vh', minWidth: '100%', width: '100vw' }}>
            
                <div className="row p-0 g-0 mt-5">
                    <div className="col-12 p-0" style={{ height: '20vh' }}>
                        
                    </div>
                </div>
                <div className="row p-0 g-0 mt-5">
                    <div className="col-12 p-0 d-flex justify-content-center">
                        <Icon_Warnning fill='red' width={54} height={54} />
                    </div>
                </div>
                <div className="row p-0 g-0 mt-2">
                    <div className="col-12 p-0 d-flex justify-content-center roboto-h2">
                        {props.message}
                    </div>
                </div>
            
        </div>
    )
}

export default WarnningPanel;