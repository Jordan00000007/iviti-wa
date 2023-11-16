import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import ivitLogo from'../../assets/iVIT-I_W.png';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

function CustomHeader() {

    const pathname = window.location.pathname;

    const [showComfirmBackModal, setShowComfirmBackModal] = useState(false);
    const [homePage, setHomePage] = useState(true);

    const handleLogoClick = (event) => {

        if ((pathname.indexOf('addTask') >= 0) || (pathname.indexOf('editTask') >= 0)) {
            log('show message')
            setShowComfirmBackModal(true);

        }
        else {
            window.location.href = "/";

        }

    };

    const handleGoMainPage = (event) => {
        window.location.href = "/";
    }

    useEffect(() => {

        if ((pathname.indexOf('addTask') >= 0) || (pathname.indexOf('editTask') >= 0) || (pathname.indexOf('inference') >= 0)) {

            setHomePage(false);
        }
        else {

            setHomePage(true);
        }

    }, [pathname]);

    return (
        <>

            <div className="my-header">

                <div className="row p-0 g-0">
                    <div className="col-12 p-0">

                        {
                            (homePage) &&
                            <a href="./">

                                <div style={{ position: 'relative', height: 56 }}>
                                    {/* <Logo style={{ cursor: 'pointer', height: 48, position: 'absolute', top: 4, left: -12 }} /> */}
                                    <img  src={ivitLogo} style={{ cursor: 'pointer', height: 42, position: 'absolute', top: 7, left: -16 }}/>
                                </div>



                            </a>
                        }
                        {
                            (!homePage) &&
                           
                            <div style={{position:'relative',height:56}}>
                                        <Logo onClick={handleLogoClick} style={{ cursor: 'pointer',height:48,position:'absolute',top:4,left:-12 }} />
                            </div>
                        }

                    </div>
                </div>

            </div>




            <Modal
                open={showComfirmBackModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 400 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 roboto-h2 p-0'>
                                <div>
                                    Confirm back to main page?
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 roboto-b1 p-0' style={{ color: 'var(--on_color_1)' }}>
                                <div style={{ paddingTop: 24 }}>
                                    Everything not saved will be lost.
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end' style={{ padding: 0 }}>
                                <div style={{ paddingTop: 225 }} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowComfirmBackModal(false);
                                    }} />
                                    <CustomButton name="confirm" onClick={handleGoMainPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>


        </>
    )

}

export default CustomHeader;