import React, { useState, useEffect, useRef } from 'react';
import log from "../../utils/console";
import '../../css/test.css';

const NginxSettings = () => {

    const exampleRef = useRef(null);

    const handleClick = () => {
        log('handle click');
        //var el=document.getElementById('example'); el.webkitRequestFullscreen();
        exampleRef.current.webkitRequestFullscreen();
    }

    return (
        <div>
            <h2>:fullscreen pseudo-class example</h2>
            <div className="card border-0">
                <div className="card-body my-card-l p-3">
                    <div className="container">
                        <div className="example" ref={exampleRef}>
                            <p>Fullscreen mode</p>
                        </div>
                    </div>
                </div>
            </div>


            <br />
            <button onClick={handleClick}>Click here</button>
        </div>
    );
};

export default NginxSettings;
