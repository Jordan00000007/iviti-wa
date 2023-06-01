import React, { useRef, useState } from 'react';
import log from "../../utils/console";
import LabelButton from '../../components/Buttons/LabelButton';
import { Modal, Button } from "react-bootstrap";

const LabelPanel = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const showData = props.dependOnArr[props.index];

    if (showData) {

        if ((showData.length <= 3) && (showData.length > 0))
            return (
                <div style={{ gap: '10px', display: 'flex' }}>
                    {showData.map((item, index) => (
                        <LabelButton name={item} key={index} type="truncate"/>
                    ))}
                </div>
            )

        if (showData.length >= 4)
            return (
                <div style={{ gap: '10px', display: 'flex' }}>
                    {showData.slice(0, 3).map((item, index) => (
                        <LabelButton name={item} key={index} type="truncate"/>
                    ))}
                    <LabelButton name='...' onClick={handleShow} type="expand"/>



                    <Modal show={show} onHide={handleClose} aria-labelledby="contained-modal-title-vcenter" centered>
                        <Modal.Header>
                            <Modal.Title className='roboto-h2'>{(props.area!==undefined)?props.area[1]:"N/A"} depend on</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container-fluid p-0" style={{width:450}}>
                                <div className="row" style={{width:430,height:180,overflowY:'scroll'}}>
                                <div className="col-12">
                                    {showData.map((item, index) => (
                                        
                                        <LabelButton name={item} key={index} type="list"/>
                                       
                                    ))}
                                    </div>
                                </div>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <LabelButton onClick={handleClose} name="Close" type="close" />
                        </Modal.Footer>
                    </Modal>


                </div>
            )
    }


    return (
        <div>
        </div>
    )
}

export default LabelPanel;