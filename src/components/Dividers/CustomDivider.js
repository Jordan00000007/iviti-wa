import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

function CustomDivider() {

    useEffect(() => {
         
    }, []);

    return (
        <>

            <div style={{position:'relative',textAlign:'center'}}>
        
                
                <hr className='my-divider' />
                <div style={{position:'absolute',top:-14,left:0,width:'100%',textAlign:'center'}}>
                    <span className='roboto-c' style={{background:'white',textAlign:'center',padding:'0px 15px',color:'#16272E52'}}>2023/07/05</span>
                </div>
                

            </div>

        </>
    )

}

export default CustomDivider;